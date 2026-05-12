// "use client";

// import API_URL from "@/app/components/lib/apiConfig";
// import DealerService from "@/app/components/services/dealerService";
// import { order } from "@/app/components/services/orderService";
// import AuditLogService from "@/app/components/services/AuditLogService";
// import { useCategory } from "@/hooks/useCategory";
// import { useDealers } from "@/hooks/useDealers";
// import { useOrders } from "@/hooks/useOrders";

// import {
//   Check,
//   X,
//   Eye,
//   Plus,
//   Download,
//   Search,
//   Pencil,
//   MoreVertical,
//   Save,
//   Loader2,
//   History,
//   Trash2,
//   Share2,
//   FileText,
// } from "lucide-react";
// import {
//   shareOrderText,
//   prepareOrderPdfFile,
//   sharePreparedPdfFile,
//   downloadOrderPdf,
// } from "@/app/components/lib/orderShareUtils";
// import { useRouter } from "next/navigation";
// import { useState, useMemo, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// const statusStyle: any = {
//   Pending: "bg-yellow-100 text-yellow-600",
//   Unapproved: "bg-gray-100 text-blue-600",
//   Rejected: "bg-red-100 text-red-600",
//   Posted: "bg-green-100 text-green-600",
//   Approved: "bg-yellow-100 text-yellow-600",
//   Dispatched: "bg-blue-100 text-blue-600",
//   Partial: "bg-orange-100 text-orange-600",
// };

// export default function OrdersPage() {
//   const [openMenu, setOpenMenu] = useState(null);
//   const user = useSelector((state: any) => state.user.user);
//   const isDispatcher = user?.user_type === "dispatcher";
//   const isManager = user?.user_type === "manager";
//   const canEditFull =
//     user?.user_type === "admin" || user?.user_type === "salesman";
//   const { data: categories = [] } = useCategory(user?.industry);
//   const { data, refetch } = useOrders(user?.industry);
//   const router = useRouter();

//   const [search, setSearch] = useState("");
//   const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
//   const [confirmAction, setConfirmAction] = useState<
//     "approve" | "reject" | "unapprove" | "delete" | null
//   >(null);
//   const [viewOrder, setViewOrder] = useState<any>(null);
//   const [viewItems, setViewItems] = useState<any[]>([]);
//   const [auditLogs, setAuditLogs] = useState<any[]>([]);
//   const [auditLoading, setAuditLoading] = useState(false);
//   const [historyOrder, setHistoryOrder] = useState<any>(null);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [viewLoading, setViewLoading] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");
//   const [editOrder, setEditOrder] = useState<any>(null);
//   const [editItems, setEditItems] = useState<any[]>([]);
//   const [productMap, setProductMap] = useState<any>({});
//   const [editLoading, setEditLoading] = useState(false);
//   const [editSaving, setEditSaving] = useState(false);
//   const [editFields, setEditFields] = useState<any>({});
//   const [preparedPdfFile, setPreparedPdfFile] = useState<File | null>(null);
//   const [preparedPdfOrder, setPreparedPdfOrder] = useState<any>(null);
//   const [pdfPreparingId, setPdfPreparingId] = useState<string | null>(null);
//   const [deleteEditItemConfirm, setDeleteEditItemConfirm] = useState<{
//     index: number;
//     item: any;
//   } | null>(null);
//   const { data: dealer } = useDealers(user?.industry);
//   const dealers = dealer?.dealers || [];
//   const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

//   const ORDERS_PER_PAGE = 5;
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const handleClickOutside = (e: any) => {
//       if ((e.target as HTMLElement).closest(".dropdown-menu")) return;
//       setOpenMenu(null);
//     };
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const loadProducts = async () => {
//       const newMap: any = { ...productMap };
//       for (const item of editItems) {
//         if (item.category_id && !newMap[item.category_id]) {
//           const res = await order.getProductsByCategory(item.category_id);
//           newMap[item.category_id] = res?.products || res || [];
//         }
//       }
//       setProductMap(newMap);
//     };
//     if (editItems.length > 0) loadProducts();
//   }, [editItems]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   const filtered = useMemo(() => {
//     let result = data || [];
//     if (search.trim())
//       result = result?.filter((o: any) =>
//         o?.order_number?.toLowerCase().includes(search.toLowerCase()),
//       );
//     return result;
//   }, [search, data]);

//   const totalPages = Math.ceil((filtered?.length || 0) / ORDERS_PER_PAGE);
//   const paginatedOrders = useMemo(() => {
//     const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
//     return filtered?.slice(startIndex, startIndex + ORDERS_PER_PAGE);
//   }, [filtered, currentPage]);

//   const formatStatus = (status: string) =>
//     status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
//   const getRoleKey = (person: any) => {
//     return String(person?.user_type || person?.role || "").toLowerCase();
//   };

//   const getRoleLabel = (person: any) => {
//     const role = getRoleKey(person);

//     if (role === "admin") return "Director";
//     if (role === "salesman") return "Salesman";
//     if (role === "dispatcher") return "Dispatcher";
//     if (role === "manager") return "Manager";
//     if (role === "accountant") return "Accountant";
//     if (role === "super_admin") return "Super Admin";

//     return "User";
//   };

//   const getCreatedByText = (createdBy: any) => {
//     if (!createdBy?.name) return "-";
//     return `${createdBy.name} (${getRoleLabel(createdBy)})`;
//   };

//   const getPerformedByText = (log: any) => {
//     const name = log?.performedBy?.name || log?.performedByName || "System";

//     const role =
//       log?.performedBy?.user_type ||
//       log?.performedBy?.role ||
//       log?.performedByRole ||
//       "";

//     if (!role) return name;

//     return `${name} (${getRoleLabel({ user_type: role })})`;
//   };
//   const hiddenAuditFields = [
//     "_id",
//     "businessId",
//     "created_by",
//     "updated_by",
//     "dealer_id",
//     "__v",
//   ];

//   const formatAuditField = (field: string) => {
//     const labels: any = {
//       order_number: "Order Number",
//       payment_term: "Payment Term",
//       due_date: "Due Date",
//       deliveryNotes: "Delivery Notes",
//       status: "Status",
//       rejectReason: "Reject Reason",
//       subtotal: "Subtotal",
//       total: "Total",
//       discount: "Discount",
//       tax: "Tax",
//     };

//     return labels[field] || field.replaceAll("_", " ");
//   };

//   const formatAuditValue = (value: any) => {
//     if (value === null || value === undefined || value === "") return "-";

//     if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
//       return new Date(value).toLocaleDateString("en-GB");
//     }

//     if (typeof value === "object") {
//       if (value?.name) return value.name;
//       if (value?.businessName) return value.businessName;
//       if (value?.order_number) return value.order_number;
//       return "-";
//     }

//     return String(value);
//   };
//   const getItemName = (item: any) => {
//     return (
//       item?.item_name || item?.product_id?.name || item?.product_name || "Item"
//     );
//   };

//   const getItemSignature = (item: any) => {
//     return String(
//       item?.product_id?._id || item?.product_id || item?.item_name || item?._id,
//     );
//   };

//   const getItemChanges = (oldItems: any[] = [], newItems: any[] = []) => {
//     const changes: any[] = [];

//     const oldMap = new Map();
//     const newMap = new Map();

//     oldItems.forEach((item) => {
//       oldMap.set(getItemSignature(item), item);
//     });

//     newItems.forEach((item) => {
//       newMap.set(getItemSignature(item), item);
//     });

//     newItems.forEach((newItem) => {
//       const key = getItemSignature(newItem);
//       const oldItem = oldMap.get(key);

//       if (!oldItem) {
//         changes.push({
//           type: "ADDED",
//           text: `${getItemName(newItem)} added`,
//         });
//         return;
//       }

//       if (Number(oldItem.quantity) !== Number(newItem.quantity)) {
//         changes.push({
//           type: "UPDATED",
//           text: `${getItemName(newItem)} quantity changed ${oldItem.quantity} → ${newItem.quantity}`,
//         });
//       }

//       if (Number(oldItem.unit_price) !== Number(newItem.unit_price)) {
//         changes.push({
//           type: "UPDATED",
//           text: `${getItemName(newItem)} price changed ${oldItem.unit_price} → ${newItem.unit_price}`,
//         });
//       }

//       if (
//         Number(oldItem.discount_percent) !== Number(newItem.discount_percent)
//       ) {
//         changes.push({
//           type: "UPDATED",
//           text: `${getItemName(newItem)} discount changed ${oldItem.discount_percent} → ${newItem.discount_percent}`,
//         });
//       }

//       if (Number(oldItem.total) !== Number(newItem.total)) {
//         changes.push({
//           type: "UPDATED",
//           text: `${getItemName(newItem)} total changed ${oldItem.total} → ${newItem.total}`,
//         });
//       }
//     });

//     oldItems.forEach((oldItem) => {
//       const key = getItemSignature(oldItem);

//       if (!newMap.has(key)) {
//         changes.push({
//           type: "REMOVED",
//           text: `${getItemName(oldItem)} removed`,
//         });
//       }
//     });

//     return changes;
//   };
//   const handleAction = (
//     orderId: string,
//     action: "approve" | "reject" | "unapprove" | "delete",
//   ) => {
//     setConfirmOrderId(orderId);
//     setConfirmAction(action);
//     if (action === "reject") setRejectReason("");
//   };

//   const handleConfirm = async () => {
//     if (confirmAction === "approve") {
//       const res = await order.updateStatus(confirmOrderId, {
//         status: "approved",
//       });
//       if (!res.success)
//         return toast.error(res?.message || "Problem approving order");
//       toast.success(res?.message);
//       await refetch();
//     } else if (confirmAction === "delete") {
//       const res = await order.deleteOrder(confirmOrderId);
//       if (!res.success)
//         return toast.error(res?.message || "Problem deleting order");
//       toast.success(res?.message || "Order deleted");
//       await refetch();
//     } else if (confirmAction === "unapprove") {
//       const res = await order.updateStatus(confirmOrderId, {
//         status: "unapproved",
//       });
//       if (!res.success)
//         return toast.error(res?.message || "Problem unapproving order");
//       toast.success(res?.message || "Order unapproved successfully");
//       await refetch();
//     } else if (confirmAction === "reject") {
//       if (user?.user_type === "salesman") {
//         const res = await order.deleteOrder(confirmOrderId);
//         if (!res.success)
//           return toast.error(res?.message || "Problem deleting order");
//         toast.success(res?.message);
//       } else {
//         const res = await order.updateStatus(confirmOrderId, {
//           status: "rejected",
//           rejectReason,
//         });
//         if (!res.success)
//           return toast.error(res?.message || "Problem rejecting order");
//         toast.success(res?.message);
//       }
//       await refetch();
//     }
//     setConfirmOrderId(null);
//     setConfirmAction(null);
//   };

//   const handleView = async (orderId: string) => {
//     setViewLoading(true);

//     try {
//       const res = await order.getOrderById(orderId);

//       if (!res.success) {
//         return toast.error(res?.message || "Failed to load order");
//       }

//       setViewOrder(res.order);
//       setViewItems(res.items || []);
//     } catch {
//       toast.error("Failed to load order details");
//     } finally {
//       setViewLoading(false);
//     }
//   };

//   const handleShareOrder = async (
//     selectedOrder: any,
//     type: "text" | "prepare-pdf" | "share-ready-pdf" | "download",
//   ) => {
//     try {
//       setOpenMenu(null);

//       const res = await order.getOrderById(selectedOrder._id);

//       if (!res?.success) {
//         return toast.error(res?.message || "Failed to load order");
//       }

//       if (type === "text") {
//         const result = await shareOrderText(res.order, res.items || []);

//         if (!result.success && !result.cancelled) {
//           toast.error(result.message || "Share failed");
//         }

//         if (result?.message && result.success) {
//           toast.success(result.message);
//         }

//         return;
//       }

//       if (type === "prepare-pdf") {
//         setPdfPreparingId(selectedOrder._id);
//         toast.loading("Preparing PDF...", { id: "prepare-pdf" });

//         const file = await prepareOrderPdfFile(res.order);

//         setPreparedPdfFile(file);
//         setPreparedPdfOrder(res.order);

//         toast.dismiss("prepare-pdf");
//         toast.success("PDF ready. Now click Share Ready PDF.");

//         return;
//       }

//       if (type === "share-ready-pdf") {
//         if (!preparedPdfFile || !preparedPdfOrder) {
//           return toast.error("Please prepare PDF first");
//         }

//         const result = await sharePreparedPdfFile(
//           preparedPdfOrder,
//           preparedPdfFile,
//         );

//         if (!result.success && !result.cancelled) {
//           return toast.error(result.message || "PDF share failed");
//         }

//         if (result.success) {
//           toast.success("PDF shared");
//         }

//         return;
//       }

//       if (type === "download") {
//         const result = await downloadOrderPdf(res.order);

//         if (!result.success) {
//           return toast.error(result.message || "PDF download failed");
//         }

//         toast.success("PDF downloaded");
//       }
//     } catch (error: any) {
//       toast.dismiss("prepare-pdf");
//       toast.error(error?.message || "Action failed");
//     } finally {
//       setPdfPreparingId(null);
//     }
//   };
//   const handleHistory = async (selectedOrder: any) => {
//     setHistoryOrder(selectedOrder);
//     setHistoryLoading(true);
//     setAuditLogs([]);

//     try {
//       const logsRes = await AuditLogService.getEntityAuditLogs(
//         "ORDER",
//         selectedOrder._id,
//       );

//       if (logsRes?.success) {
//         setAuditLogs(logsRes?.data || []);
//       } else {
//         setAuditLogs([]);
//       }
//     } catch {
//       toast.error("Failed to load history");
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const handleEdit = async (orderId: string) => {
//     setEditLoading(true);
//     setEditOrder({ _placeholder: true });
//     try {
//       const res = await order.getOrderById(orderId);
//       if (!res.success) {
//         setEditOrder(null);
//         return toast.error(res?.message || "Failed to load order");
//       }
//       setEditOrder(res.order);
//       setEditItems(
//         res.items.map((item: any) => ({
//           ...item,
//           product_id: item.product_id || "",
//           category_id: item.category_id || "",
//           discount_type: item.discount_type || "percent",
//         })),
//       );
//       setEditFields({
//         due_date: res.order?.due_date
//           ? new Date(res.order.due_date).toISOString().split("T")[0]
//           : "",
//         deliveryNotes: res.order?.deliveryNotes || "",
//         payment_term: res.order?.payment_term || "cash",
//         discount_type: res.order?.discount_type || "amount",
//         tax_type: res.order?.tax_type || "amount",
//         dealer_id: res.order?.dealer_id?._id || "",
//         discount:
//           res.order?.discount_type === "percent"
//             ? res.order?.subtotal > 0
//               ? ((res.order.discount / res.order.subtotal) * 100).toFixed(2)
//               : 0
//             : res.order?.discount || 0,
//         tax:
//           res.order?.tax_type === "percent"
//             ? res.order?.subtotal - res.order?.discount > 0
//               ? (
//                   (res.order.tax / (res.order.subtotal - res.order.discount)) *
//                   100
//                 ).toFixed(2)
//               : 0
//             : res.order?.tax || 0,
//       });
//     } catch {
//       setEditOrder(null);
//       toast.error("Failed to load order details");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const round2 = (value: any) => {
//     return Math.round((Number(value) || 0) * 100) / 100;
//   };

//   const normalizeAmountType = (type: any, defaultType = "amount") => {
//     const value = String(type || "").toLowerCase();

//     if (value === "percent" || value === "percentage") return "percent";
//     if (value === "amount" || value === "fixed") return "amount";

//     return defaultType;
//   };

//   const calculateEditItemTotal = (item: any) => {
//     const qty = Number(item?.quantity || 0);
//     const price = Number(item?.unit_price || 0);
//     const discount = Number(item?.discount_percent || 0);
//     const discountType = normalizeAmountType(item?.discount_type, "percent");

//     const gross = qty * price;
//     const discountAmount =
//       discountType === "amount" ? discount : (gross * discount) / 100;

//     return round2(Math.max(gross - discountAmount, 0));
//   };

//   const isEditItemFilled = (item: any) => {
//     return Boolean(
//       item?.category_id ||
//       item?.product_id ||
//       String(item?.item_name || "").trim() ||
//       Number(item?.unit_price || 0) > 0 ||
//       Number(item?.discount_percent || 0) > 0 ||
//       Number(item?.total || 0) > 0 ||
//       Number(item?.quantity || 1) > 1,
//     );
//   };

//   const handleEditItemChange = (index: number, field: string, value: any) => {
//     setEditItems((prev) => {
//       const updated = [...prev];

//       updated[index] = {
//         ...updated[index],
//         [field]: ["quantity", "unit_price", "discount_percent"].includes(field)
//           ? value === ""
//             ? 0
//             : Number(value)
//           : value,
//       };

//       updated[index].discount_type = normalizeAmountType(
//         updated[index].discount_type,
//         "percent",
//       );

//       updated[index].total = calculateEditItemTotal(updated[index]);

//       return updated;
//     });
//   };

//   const handleAddItem = () =>
//     setEditItems((prev) => [
//       ...prev,
//       {
//         category_id: "",
//         product_id: "",
//         item_name: "",
//         quantity: 1,
//         unit_price: 0,
//         discount_percent: 0,
//         discount_type: "percent",
//         total: 0,
//       },
//     ]);

//   const handleRemoveItem = (index: number) => {
//     const item = editItems[index];

//     if (!isEditItemFilled(item)) {
//       setEditItems((prev) => prev.filter((_, i) => i !== index));
//       return;
//     }

//     setDeleteEditItemConfirm({ index, item });
//   };

//   const handleConfirmEditItemDelete = () => {
//     if (!deleteEditItemConfirm) return;

//     const { index, item } = deleteEditItemConfirm;

//     setEditItems((prev) => prev.filter((_, i) => i !== index));
//     toast.success(`${getItemName(item)} removed`);
//     setDeleteEditItemConfirm(null);
//   };

//   const computedTotals = useMemo(() => {
//     const itemsSubtotal = round2(
//       editItems.reduce((sum, item) => sum + calculateEditItemTotal(item), 0),
//     );

//     const discount = Number(editFields.discount) || 0;
//     const tax = Number(editFields.tax) || 0;

//     const discountType = normalizeAmountType(
//       editFields.discount_type,
//       "amount",
//     );
//     const taxType = normalizeAmountType(editFields.tax_type, "amount");

//     const discountAmt =
//       discountType === "percent"
//         ? round2((itemsSubtotal * discount) / 100)
//         : round2(discount);

//     const taxable = Math.max(itemsSubtotal - discountAmt, 0);

//     const taxAmt =
//       taxType === "percent" ? round2((taxable * tax) / 100) : round2(tax);

//     return {
//       subtotal: itemsSubtotal,
//       discountAmt,
//       taxAmt,
//       total: round2(Math.max(taxable + taxAmt, 0)),
//     };
//   }, [editItems, editFields]);

//   const handleEditSave = async () => {
//     setEditSaving(true);
//     let payload: any;

//     if (isDispatcher || isManager) {
//       if (!editOrder?.status) {
//         setEditSaving(false);
//         return toast.error("Status is required");
//       }

//       payload = {
//         status: editOrder?.status,
//         deliveryNotes: editFields.deliveryNotes,
//         payment_term: editFields.payment_term,
//       };
//     } else if (user?.user_type === "accountant") {
//       if (!editOrder?.status) {
//         setEditSaving(false);
//         return toast.error("Status is required");
//       }

//       payload = {
//         status: editOrder?.status,
//         payment_term: editFields.payment_term,
//       };
//     } else if (canEditFull) {
//       const validEditItems = editItems.filter(isEditItemFilled);

//       if (validEditItems.length === 0) {
//         setEditSaving(false);
//         return toast.error("Please add at least one valid item");
//       }

//       payload = {
//         due_date: editFields.due_date,
//         deliveryNotes: editFields.deliveryNotes,
//         payment_term: editFields.payment_term,
//         discount: Number(editFields.discount) || 0,
//         discount_type: normalizeAmountType(editFields.discount_type, "amount"),
//         tax: Number(editFields.tax) || 0,
//         dealer_id: editFields.dealer_id,
//         tax_type: normalizeAmountType(editFields.tax_type, "amount"),
//         items: validEditItems.map((item) => ({
//           _id: item._id,
//           product_id: item.product_id?._id || item.product_id || null,
//           category_id: item.category_id?._id || item.category_id || null,
//           quantity: Number(item.quantity) || 1,
//           item_name: item?.item_name,
//           unit_price: Number(item.unit_price) || 0,
//           discount_percent: Number(item.discount_percent) || 0,
//           discount_type: normalizeAmountType(item.discount_type, "percent"),
//           total: calculateEditItemTotal(item),
//         })),
//         subtotal: computedTotals.subtotal,
//         total: computedTotals.total,
//         status: editOrder?.status,
//       };
//     }

//     const res = await order.updateOrder(payload, editOrder?._id);

//     if (!res.success) {
//       setEditSaving(false);
//       return toast.error(res?.message || "Failed to update order");
//     }

//     toast.success(res?.message || "Order updated successfully");
//     closeEditModal();
//     setEditSaving(false);
//     await refetch();
//   };

//   const closeEditModal = () => {
//     setEditOrder(null);
//     setEditItems([]);
//     setEditFields({});
//     setDeleteEditItemConfirm(null);
//   };

//   const isGeneralCategory = (categoryId: any) => {
//     const cat = categories.find((c: any) => c._id === categoryId);
//     return cat?.name === "General Appliances";
//   };


//   const getStatusKey = (status: any) => String(status || "").toLowerCase();

// const isOwnOrder = (selectedOrder: any) =>
//   String(selectedOrder?.created_by?._id) === String(user?._id);

// const canShareOrder = (selectedOrder: any) => {
//   const status = getStatusKey(selectedOrder?.status);

//   // Salesman can share only his own approved order
//   if (user?.user_type === "salesman") {
//     return status === "approved" && isOwnOrder(selectedOrder);
//   }

//   // Other roles can share these final/workflow orders
//   return ["approved", "partial", "dispatched", "posted"].includes(status);
// };

// const actionTriggerCls =
//   "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-900 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20";

// const menuItemCls =
//   "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-40";

// const menuDangerCls =
//   "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:shadow-sm disabled:pointer-events-none disabled:opacity-40";

// const menuIconCls =
//   "shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-white";

// const menuDangerIconCls =
//   "shrink-0 text-red-400 transition-colors duration-200 group-hover:text-red-600";
//   const isFinancialLocked =
//     isDispatcher ||
//     isManager ||
//     user?.user_type === "accountant" ||
//     editOrder?.status === "dispatched" ||
//     editOrder?.status === "posted";

//   const inputCls =
//     "w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white";
//   const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

//   return (
//     <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">
//       {/* ── CONFIRM MODAL ── */}
//       {confirmOrderId && confirmAction && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
//             <h2 className="text-base font-semibold text-gray-800 mb-2">
//               {confirmAction === "delete"
//                 ? "Delete Order?"
//                 : confirmAction === "approve"
//                   ? "Approve Order?"
//                   : confirmAction === "unapprove"
//                     ? "Unapprove Order?"
//                     : user?.user_type === "salesman"
//                       ? "Delete Order?"
//                       : "Reject Order?"}
//             </h2>
//             {confirmAction === "reject" && user?.user_type !== "salesman" && (
//               <div className="mb-3">
//                 <label className={labelCls}>
//                   Reject Reason <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                   placeholder="Write reason for rejection..."
//                   className={`${inputCls} resize-none`}
//                   rows={3}
//                 />
//               </div>
//             )}
//             <p className="text-sm text-gray-500 mb-4">
//               {confirmAction === "delete"
//                 ? "Are you sure you want to permanently delete this order?"
//                 : confirmAction === "approve"
//                   ? "Are you sure you want to approve this order?"
//                   : confirmAction === "unapprove"
//                     ? "Move this order back to unapproved?"
//                     : `Are you sure you want to ${user?.user_type === "admin" ? "reject" : "delete"} this order?`}
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   setConfirmOrderId(null);
//                   setConfirmAction(null);
//                 }}
//                 className="px-3 py-1.5 rounded-lg border text-gray-600 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirm}
//                 disabled={
//                   confirmAction === "reject" &&
//                   user?.user_type !== "salesman" &&
//                   !rejectReason.trim()
//                 }
//                 className={`px-3 py-1.5 rounded-lg text-white text-sm disabled:opacity-50 ${confirmAction === "approve" ? "bg-green-500" : confirmAction === "unapprove" ? "bg-yellow-500" : "bg-red-500"}`}
//               >
//                 {confirmAction === "delete"
//                   ? "Delete"
//                   : confirmAction === "approve"
//                     ? "Approve"
//                     : confirmAction === "unapprove"
//                       ? "Unapprove"
//                       : user?.user_type === "salesman"
//                         ? "Delete"
//                         : "Reject"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteEditItemConfirm && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
//           <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
//             <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
//               <Trash2 size={20} className="text-red-500" />
//             </div>

//             <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
//               Delete Item
//             </h2>

//             <p className="text-sm text-gray-500 text-center mb-5">
//               Are you sure you want to remove{" "}
//               <span className="font-medium text-gray-800">
//                 {getItemName(deleteEditItemConfirm.item)}
//               </span>
//               ?
//             </p>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => setDeleteEditItemConfirm(null)}
//                 className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleConfirmEditItemDelete}
//                 className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {historyOrder && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
//           <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
//               <div>
//                 <h2 className="text-sm font-semibold text-gray-800">
//                   Order History
//                 </h2>
//                 <p className="text-xs text-gray-400">
//                   {historyOrder?.order_number}
//                 </p>
//               </div>

//               <button
//                 onClick={() => {
//                   setHistoryOrder(null);
//                   setAuditLogs([]);
//                 }}
//                 className="p-1.5 hover:bg-gray-100 rounded-lg"
//               >
//                 <X size={16} />
//               </button>
//             </div>

//             <div className="overflow-y-auto flex-1 p-4">
//               {historyLoading ? (
//                 <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
//                   Loading history...
//                 </div>
//               ) : auditLogs.length === 0 ? (
//                 <div className="py-12 text-center text-gray-400 text-sm">
//                   No history found
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {auditLogs.map((log: any, i: number) => (
//                     <div
//                       key={log?._id || i}
//                       className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-xs"
//                     >
//                       <div className="flex items-center justify-between gap-2 mb-1">
//                         <p className="font-semibold text-gray-800">
//                           {String(log.action || "").replaceAll("_", " ")}
//                         </p>

//                         <p className="text-gray-400">
//                           {log.createdAt
//                             ? new Date(log.createdAt).toLocaleString()
//                             : "-"}
//                         </p>
//                       </div>

//                       <p className="text-gray-500">
//                         {log.description || "Action performed"}
//                       </p>

//                       <p className="text-gray-400 mt-1">
//                         by {getPerformedByText(log)}
//                       </p>

//                       {log.changes && Object.keys(log.changes).length > 0 && (
//                         <div className="mt-2 space-y-1">
//                           {Object.entries(log.changes)
//                             .filter(
//                               ([field]) => !hiddenAuditFields.includes(field),
//                             )
//                             .slice(0, 8)
//                             .map(([field, value]: any) => (
//                               <p key={field} className="text-gray-500">
//                                 <span className="font-medium">
//                                   {formatAuditField(field)}
//                                 </span>
//                                 : <span>{formatAuditValue(value?.from)}</span>
//                                 {" → "}
//                                 <span>{formatAuditValue(value?.to)}</span>
//                               </p>
//                             ))}
//                         </div>
//                       )}

//                       {log?.meta?.oldItems && log?.meta?.newItems && (
//                         <div className="mt-2 space-y-1">
//                           {getItemChanges(log.meta.oldItems, log.meta.newItems)
//                             .slice(0, 8)
//                             .map((itemChange: any, index: number) => (
//                               <p key={index} className="text-gray-500">
//                                 <span className="font-medium">
//                                   {itemChange.type}
//                                 </span>
//                                 : {itemChange.text}
//                               </p>
//                             ))}
//                         </div>
//                       )}

//                       {log?.meta?.items && log?.meta?.items?.length > 0 && (
//                         <div className="mt-2 space-y-1">
//                           {log.meta.items
//                             .slice(0, 8)
//                             .map((item: any, index: number) => (
//                               <p key={index} className="text-gray-500">
//                                 <span className="font-medium">ADDED</span>:{" "}
//                                 {getItemName(item)} added
//                               </p>
//                             ))}
//                         </div>
//                       )}

//                       {log?.meta?.deletedItems &&
//                         log?.meta?.deletedItems?.length > 0 && (
//                           <div className="mt-2 space-y-1">
//                             {log.meta.deletedItems
//                               .slice(0, 8)
//                               .map((item: any, index: number) => (
//                                 <p key={index} className="text-gray-500">
//                                   <span className="font-medium">REMOVED</span>:{" "}
//                                   {getItemName(item)} removed
//                                 </p>
//                               ))}
//                           </div>
//                         )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── VIEW MODAL ── */}
//       {(viewOrder || viewLoading) && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
//           <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
//             {viewLoading ? (
//               <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
//                 Loading...
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
//                   <div>
//                     <h2 className="text-sm font-semibold text-gray-800">
//                       {viewOrder?.order_number}
//                     </h2>
//                     <span
//                       className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(viewOrder?.status)]}`}
//                     >
//                       {formatStatus(viewOrder?.status)}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setViewOrder(null);
//                       setViewItems([]);
//                       setAuditLogs([]);
//                     }}
//                     className="p-1.5 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//                 <div className="overflow-y-auto flex-1 p-4 space-y-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-gray-50 rounded-xl p-3">
//                       <p className="text-xs text-gray-400 mb-0.5">Dealer</p>
//                       <p className="text-sm font-medium">
//                         {viewOrder?.dealer_id?.name}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-2 mb-0.5">
//                         Created By
//                       </p>
//                       {/* <p className="text-sm">{viewOrder?.created_by?.name} ({viewOrder?.created_by?.user_type === "admin" ? "Director" : "Salesman"})</p> */}
//                       <p className="text-sm">
//                         {getCreatedByText(viewOrder?.created_by)}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 rounded-xl p-3">
//                       <p className="text-xs text-gray-400 mb-0.5">Order Date</p>
//                       <p className="text-sm font-medium">
//                         {viewOrder?.order_date
//                           ? new Date(viewOrder.order_date).toLocaleDateString(
//                               "en-GB",
//                             )
//                           : "-"}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-2 mb-0.5">
//                         Due Date
//                       </p>
//                       <p className="text-sm font-medium">
//                         {viewOrder?.due_date
//                           ? new Date(viewOrder.due_date).toLocaleDateString(
//                               "en-GB",
//                             )
//                           : "-"}
//                       </p>
//                     </div>
//                   </div>
//                   {viewOrder?.deliveryNotes && (
//                     <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
//                       <p className="text-xs text-yellow-600 font-medium mb-1">
//                         Delivery Notes
//                       </p>
//                       <p className="text-sm text-gray-700">
//                         {viewOrder.deliveryNotes}
//                       </p>
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                       Order Items
//                     </p>
//                     <div className="border border-gray-200 rounded-xl overflow-x-auto">
//                       <table className="w-full text-sm min-w-[380px]">
//                         <thead className="bg-gray-50 text-gray-500 text-xs">
//                           <tr>
//                             <th className="text-left px-3 py-2">Product</th>
//                             <th className="px-3 py-2 text-center">Qty</th>
//                             <th className="px-3 py-2 text-center">Price</th>
//                             <th className="px-3 py-2 text-center">Disc</th>
//                             <th className="px-3 py-2 text-right">Total</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {viewItems.map((item: any, i: number) => (
//                             <tr key={i} className="border-t border-gray-100">
//                               <td className="px-3 py-2">
//                                 {item?.item_name || item?.product_id?.name}
//                               </td>
//                               <td className="px-3 py-2 text-center">
//                                 {item?.quantity}
//                               </td>
//                               <td className="px-3 py-2 text-center">
//                                 {item?.unit_price}
//                               </td>
//                               <td className="px-3 py-2 text-center">
//                                 {item?.discount_percent}
//                                 {item?.discount_type === "amount"
//                                   ? " Amt"
//                                   : "%"}
//                               </td>
//                               <td className="px-3 py-2 text-right">
//                                 {item?.total?.toFixed(2)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                   {viewOrder?.rejectReason && (
//                     <div className="bg-red-50 border border-red-200 rounded-xl p-3">
//                       <p className="text-xs text-red-600 font-semibold mb-1">
//                         Rejection Reason
//                       </p>
//                       <p className="text-sm text-gray-700">
//                         {viewOrder?.rejectReason}
//                       </p>
//                     </div>
//                   )}

//                   <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Subtotal</span>
//                       <span>{viewOrder?.subtotal}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Discount</span>
//                       <span>- {viewOrder?.discount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Tax</span>
//                       <span>+ {viewOrder?.tax}</span>
//                     </div>
//                     <div className="flex justify-between font-semibold border-t pt-2">
//                       <span>Total</span>
//                       <span>{viewOrder?.total}</span>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── EDIT MODAL ── */}
//       {editOrder && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
//           <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
//             {editLoading ? (
//               <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
//                 <Loader2 size={18} className="animate-spin" /> Loading order...
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
//                   <div>
//                     <h2 className="text-sm font-semibold text-gray-800">
//                       Edit — {editOrder?.order_number}
//                     </h2>
//                     <span
//                       className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(editOrder?.status)]}`}
//                     >
//                       {formatStatus(editOrder?.status)}
//                     </span>
//                   </div>
//                   <button
//                     onClick={closeEditModal}
//                     className="p-1.5 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>

//                 <div className="overflow-y-auto flex-1 p-4 space-y-4">
//                   {/* Info */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="bg-gray-50 rounded-xl p-3">
//                       <p className={labelCls}>Dealer</p>
//                       {isDispatcher ||
//                       isManager ||
//                       user?.user_type === "accountant" ? (
//                         <p className="text-sm font-medium">
//                           {editOrder?.dealer_id?.name}
//                         </p>
//                       ) : (
//                         <select
//                           value={editFields.dealer_id || ""}
//                           onChange={(e) =>
//                             setEditFields((prev: any) => ({
//                               ...prev,
//                               dealer_id: e.target.value,
//                             }))
//                           }
//                           className={inputCls}
//                         >
//                           <option value="">Select Dealer</option>
//                           {dealers.map((d: any) => (
//                             <option key={d._id} value={d._id}>
//                               {d.name}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                       <p className={`${labelCls} mt-2`}>Created By</p>
//                       <p className="text-sm">
//                         {editOrder?.created_by?.name} (
//                         {editOrder?.created_by?.user_type === "admin"
//                           ? "Director"
//                           : "Salesman"}
//                         )
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 rounded-xl p-3">
//                       <p className={labelCls}>Order Date</p>
//                       <p className="text-sm font-medium">
//                         {editOrder?.order_date
//                           ? new Date(editOrder.order_date).toLocaleDateString(
//                               "en-GB",
//                             )
//                           : "-"}
//                       </p>
//                       <p className={`${labelCls} mt-2`}>Due Date</p>
//                       <input
//                         type="date"
//                         value={editFields.due_date}
//                         disabled={
//                           isDispatcher ||
//                           isManager ||
//                           user?.user_type === "accountant"
//                         }
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             due_date: e.target.value,
//                           }))
//                         }
//                         className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
//                       />
//                     </div>
//                   </div>

//                   {/* Payment + Delivery */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <label className={labelCls}>Payment Term</label>
//                       <select
//                         value={editFields.payment_term || "cash"}
//                         disabled={isDispatcher}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             payment_term: e.target.value,
//                           }))
//                         }
//                         className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="advance">Advance</option>
//                         <option value="periodical">Periodical</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className={labelCls}>Delivery Notes</label>
//                       <textarea
//                         rows={2}
//                         value={editFields.deliveryNotes}
//                         disabled={user?.user_type === "accountant"}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             deliveryNotes: e.target.value,
//                           }))
//                         }
//                         placeholder="Add delivery notes..."
//                         className={`${inputCls} resize-none disabled:bg-gray-100 disabled:text-gray-400`}
//                       />
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div>
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                         Order Items
//                       </p>
//                       {!isDispatcher &&
//                         !isManager &&
//                         user?.user_type !== "accountant" && (
//                           <button
//                             onClick={handleAddItem}
//                             className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg"
//                           >
//                             + Add Item
//                           </button>
//                         )}
//                     </div>

//                     {/* Desktop table */}
//                     {isDispatcher ||
//                     isManager ||
//                     user?.user_type === "accountant" ? (
//                       <div className="border border-gray-200 rounded-xl overflow-x-auto">
//                         <table className="w-full text-sm min-w-[380px]">
//                           <thead className="bg-gray-50 text-gray-500 text-xs">
//                             <tr>
//                               <th className="text-left px-3 py-2">Product</th>
//                               <th className="px-3 py-2 text-center">Qty</th>
//                               <th className="px-3 py-2 text-center">Price</th>
//                               <th className="px-3 py-2 text-center">Disc</th>
//                               <th className="px-3 py-2 text-right">Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {editItems.map((item: any, i: number) => (
//                               <tr key={i} className="border-t border-gray-100">
//                                 <td className="px-3 py-2">
//                                   {item?.item_name || item?.product_id?.name}
//                                 </td>
//                                 <td className="px-3 py-2 text-center">
//                                   {item?.quantity}
//                                 </td>
//                                 <td className="px-3 py-2 text-center">
//                                   {item?.unit_price}
//                                 </td>
//                                 <td className="px-3 py-2 text-center">
//                                   {item?.discount_percent}
//                                   {item?.discount_type === "amount"
//                                     ? " Amt"
//                                     : "%"}
//                                 </td>
//                                 <td className="px-3 py-2 text-right">
//                                   {item?.total?.toFixed(2)}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <>
//                         {/* Desktop editable table */}
//                         <div className="hidden md:block border border-gray-200 rounded-xl overflow-x-auto">
//                           <table className="w-full text-sm min-w-[560px]">
//                             <thead className="bg-gray-50 text-gray-500 text-xs">
//                               <tr>
//                                 <th className="px-2 py-2 text-left">
//                                   Category
//                                 </th>
//                                 <th className="px-2 py-2 text-left">Product</th>
//                                 <th className="px-2 py-2 text-center">Qty</th>
//                                 <th className="px-2 py-2 text-center">Price</th>
//                                 <th className="px-2 py-2 text-center">
//                                   Discount
//                                 </th>
//                                 <th className="px-2 py-2 text-right">Total</th>
//                                 <th className="px-2 py-2 text-center">Del</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {editItems?.map((item: any, i: number) => {
//                                 const rowProducts =
//                                   productMap[item.category_id] || [];
//                                 return (
//                                   <tr
//                                     key={i}
//                                     className="border-t border-gray-100"
//                                   >
//                                     <td className="px-1.5 py-1.5">
//                                       <select
//                                         value={item.category_id}
//                                         onChange={async (e) => {
//                                           const categoryId = e.target.value;
//                                           handleEditItemChange(
//                                             i,
//                                             "category_id",
//                                             categoryId,
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "product_id",
//                                             "",
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "item_name",
//                                             "",
//                                           );
//                                           if (!productMap[categoryId]) {
//                                             const res =
//                                               await order.getProductsByCategory(
//                                                 categoryId,
//                                               );
//                                             setProductMap((prev: any) => ({
//                                               ...prev,
//                                               [categoryId]:
//                                                 res?.products || res || [],
//                                             }));
//                                           }
//                                         }}
//                                         className={inputCls}
//                                       >
//                                         <option value="">Category</option>
//                                         {categories.map((c: any) => (
//                                           <option key={c._id} value={c._id}>
//                                             {c.name}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     </td>
//                                     <td className="px-1.5 py-1.5">
//                                       {isGeneralCategory(item.category_id) ? (
//                                         <input
//                                           type="text"
//                                           placeholder="Product name"
//                                           value={item.item_name || ""}
//                                           onChange={(e) => {
//                                             handleEditItemChange(
//                                               i,
//                                               "item_name",
//                                               e.target.value,
//                                             );
//                                             handleEditItemChange(
//                                               i,
//                                               "product_id",
//                                               "",
//                                             );
//                                           }}
//                                           className={inputCls}
//                                         />
//                                       ) : (
//                                         <select
//                                           value={
//                                             item.product_id?._id ||
//                                             item.product_id ||
//                                             ""
//                                           }
//                                           onChange={(e) => {
//                                             const product = rowProducts.find(
//                                               (p: any) =>
//                                                 String(p._id) ===
//                                                 String(e.target.value),
//                                             );
//                                             handleEditItemChange(
//                                               i,
//                                               "product_id",
//                                               e.target.value,
//                                             );
//                                             handleEditItemChange(
//                                               i,
//                                               "item_name",
//                                               product?.name || "",
//                                             );
//                                             handleEditItemChange(
//                                               i,
//                                               "unit_price",
//                                               product?.mrp || 0,
//                                             );
//                                           }}
//                                           className={inputCls}
//                                         >
//                                           <option value="">Product</option>
//                                           {rowProducts.map((p: any) => (
//                                             <option key={p._id} value={p._id}>
//                                               {p.name}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       )}
//                                     </td>
//                                     <td className="px-1.5 py-1.5">
//                                       <input
//                                         type="number"
//                                         value={item.quantity}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "quantity",
//                                             e.target.value,
//                                           )
//                                         }
//                                         className={`${inputCls} text-center`}
//                                       />
//                                     </td>
//                                     <td className="px-1.5 py-1.5">
//                                       <input
//                                         type="number"
//                                         value={item.unit_price}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "unit_price",
//                                             e.target.value,
//                                           )
//                                         }
//                                         readOnly={
//                                           !isGeneralCategory(item.category_id)
//                                         }
//                                         className={`${inputCls} text-center`}
//                                       />
//                                     </td>
//                                     <td className="px-1.5 py-1.5">
//                                       <div className="flex gap-1">
//                                         <select
//                                           value={item.discount_type}
//                                           onChange={(e) =>
//                                             handleEditItemChange(
//                                               i,
//                                               "discount_type",
//                                               e.target.value,
//                                             )
//                                           }
//                                           className="border border-gray-200 rounded-lg px-1 py-1.5 text-xs w-14 bg-white focus:outline-none"
//                                         >
//                                           <option value="percent">%</option>
//                                           <option value="amount">Amt</option>
//                                         </select>
//                                         <input
//                                           type="number"
//                                           value={item.discount_percent}
//                                           onChange={(e) =>
//                                             handleEditItemChange(
//                                               i,
//                                               "discount_percent",
//                                               e.target.value,
//                                             )
//                                           }
//                                           className={`${inputCls} text-center min-w-0`}
//                                         />
//                                       </div>
//                                     </td>
//                                     <td className="px-1.5 py-1.5 text-right text-xs font-medium whitespace-nowrap">
//                                       {(item.total ?? 0).toFixed(2)}
//                                     </td>
//                                     <td className="px-1.5 py-1.5 text-center">
//                                       <button
//                                         onClick={() => handleRemoveItem(i)}
//                                         className="p-1 bg-red-100 text-red-600 rounded-md"
//                                       >
//                                         <X size={13} />
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>

//                         {/* Mobile cards */}
//                         <div className="md:hidden space-y-3">
//                           {editItems?.map((item: any, i: number) => {
//                             const rowProducts =
//                               productMap[item.category_id] || [];
//                             return (
//                               <div
//                                 key={i}
//                                 className="border border-gray-200 rounded-xl overflow-hidden bg-white"
//                               >
//                                 <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
//                                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                     Item {i + 1}
//                                   </span>
//                                   <button
//                                     onClick={() => handleRemoveItem(i)}
//                                     className="p-1.5 bg-red-100 text-red-600 rounded-lg"
//                                   >
//                                     <X size={13} />
//                                   </button>
//                                 </div>
//                                 <div className="p-3 space-y-2.5">
//                                   <div>
//                                     <label className={labelCls}>Category</label>
//                                     <select
//                                       value={item.category_id}
//                                       onChange={async (e) => {
//                                         const categoryId = e.target.value;
//                                         handleEditItemChange(
//                                           i,
//                                           "category_id",
//                                           categoryId,
//                                         );
//                                         handleEditItemChange(
//                                           i,
//                                           "product_id",
//                                           "",
//                                         );
//                                         handleEditItemChange(
//                                           i,
//                                           "item_name",
//                                           "",
//                                         );
//                                         if (!productMap[categoryId]) {
//                                           const res =
//                                             await order.getProductsByCategory(
//                                               categoryId,
//                                             );
//                                           setProductMap((prev: any) => ({
//                                             ...prev,
//                                             [categoryId]:
//                                               res?.products || res || [],
//                                           }));
//                                         }
//                                       }}
//                                       className={inputCls}
//                                     >
//                                       <option value="">Select Category</option>
//                                       {categories.map((c: any) => (
//                                         <option key={c._id} value={c._id}>
//                                           {c.name}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>
//                                   <div>
//                                     <label className={labelCls}>Product</label>
//                                     {isGeneralCategory(item.category_id) ? (
//                                       <input
//                                         type="text"
//                                         placeholder="Enter product name"
//                                         value={item.item_name || ""}
//                                         onChange={(e) => {
//                                           handleEditItemChange(
//                                             i,
//                                             "item_name",
//                                             e.target.value,
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "product_id",
//                                             "",
//                                           );
//                                         }}
//                                         className={inputCls}
//                                       />
//                                     ) : (
//                                       <select
//                                         value={
//                                           item.product_id?._id ||
//                                           item.product_id ||
//                                           ""
//                                         }
//                                         onChange={(e) => {
//                                           const product = rowProducts.find(
//                                             (p: any) =>
//                                               String(p._id) ===
//                                               String(e.target.value),
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "product_id",
//                                             e.target.value,
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "item_name",
//                                             product?.name || "",
//                                           );
//                                           handleEditItemChange(
//                                             i,
//                                             "unit_price",
//                                             product?.mrp || 0,
//                                           );
//                                         }}
//                                         className={inputCls}
//                                       >
//                                         <option value="">Select Product</option>
//                                         {rowProducts.map((p: any) => (
//                                           <option key={p._id} value={p._id}>
//                                             {p.name}
//                                           </option>
//                                         ))}
//                                       </select>
//                                     )}
//                                   </div>
//                                   <div className="grid grid-cols-2 gap-2">
//                                     <div>
//                                       <label className={labelCls}>Price</label>
//                                       <input
//                                         type="number"
//                                         value={item.unit_price}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "unit_price",
//                                             e.target.value,
//                                           )
//                                         }
//                                         readOnly={
//                                           !isGeneralCategory(item.category_id)
//                                         }
//                                         className={`${inputCls} ${!isGeneralCategory(item.category_id) ? "bg-gray-50 text-gray-400" : ""}`}
//                                       />
//                                     </div>
//                                     <div>
//                                       <label className={labelCls}>Qty</label>
//                                       <input
//                                         type="number"
//                                         value={item.quantity}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "quantity",
//                                             e.target.value,
//                                           )
//                                         }
//                                         className={inputCls}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <label className={labelCls}>Discount</label>
//                                     <div className="flex gap-2">
//                                       <select
//                                         value={item.discount_type}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "discount_type",
//                                             e.target.value,
//                                           )
//                                         }
//                                         className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none w-16 shrink-0 bg-white"
//                                       >
//                                         <option value="percent">%</option>
//                                         <option value="amount">Amt</option>
//                                       </select>
//                                       <input
//                                         type="number"
//                                         value={item.discount_percent}
//                                         onChange={(e) =>
//                                           handleEditItemChange(
//                                             i,
//                                             "discount_percent",
//                                             e.target.value,
//                                           )
//                                         }
//                                         className={`${inputCls} min-w-0`}
//                                       />
//                                     </div>
//                                   </div>
//                                   <div className="flex justify-between items-center pt-1 border-t border-gray-100">
//                                     <span className="text-xs text-gray-400">
//                                       Item Total
//                                     </span>
//                                     <span className="text-sm font-semibold text-gray-900">
//                                       {(item.total ?? 0).toFixed(2)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                           {editItems.length === 0 && (
//                             <div className="py-6 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
//                               No items. Click "+ Add Item"
//                             </div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {/* Totals */}
//                   <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Subtotal</span>
//                       <span>{computedTotals.subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-500 w-16 shrink-0 text-xs">
//                         Discount
//                       </span>
//                       <select
//                         value={editFields.discount_type}
//                         disabled={isFinancialLocked}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             discount_type: e.target.value,
//                           }))
//                         }
//                         className="border rounded-lg px-1.5 py-1 text-xs w-16 bg-white focus:outline-none"
//                       >
//                         <option value="amount">Amt</option>
//                         <option value="percent">%</option>
//                       </select>
//                       <input
//                         type="number"
//                         value={editFields.discount}
//                         disabled={isFinancialLocked}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             discount: e.target.value,
//                           }))
//                         }
//                         className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none disabled:bg-gray-100"
//                       />
//                       <span className="text-red-500 text-xs shrink-0">
//                         - {computedTotals.discountAmt.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-500 w-16 shrink-0 text-xs">
//                         Tax
//                       </span>
//                       <select
//                         value={editFields.tax_type}
//                         disabled={isFinancialLocked}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             tax_type: e.target.value,
//                           }))
//                         }
//                         className="border rounded-lg px-1.5 py-1 text-xs w-16 bg-white focus:outline-none"
//                       >
//                         <option value="amount">Amt</option>
//                         <option value="percent">%</option>
//                       </select>
//                       <input
//                         type="number"
//                         value={editFields.tax}
//                         disabled={isFinancialLocked}
//                         onChange={(e) =>
//                           setEditFields((prev: any) => ({
//                             ...prev,
//                             tax: e.target.value,
//                           }))
//                         }
//                         className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none"
//                       />
//                       <span className="text-green-600 text-xs shrink-0">
//                         + {computedTotals.taxAmt.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between font-semibold border-t pt-2">
//                       <span>Total</span>
//                       <span>{computedTotals.total.toFixed(2)}</span>
//                     </div>
//                   </div>

//                   {/* Status */}
//                   {(isDispatcher ||
//                     isManager ||
//                     user?.user_type === "accountant" ||
//                     user?.user_type === "admin") && (
//                     <div>
//                       <label className={labelCls}>
//                         Order Status <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         value={editOrder?.status || ""}
//                         onChange={(e) =>
//                           setEditOrder((prev: any) => ({
//                             ...prev,
//                             status: e.target.value,
//                           }))
//                         }
//                         className={inputCls}
//                       >
//                         <option value={editOrder?.status}>
//                           {formatStatus(editOrder?.status)}
//                         </option>
//                         {((isDispatcher &&
//                           editOrder?.status !== "dispatched") ||
//                           isManager) && (
//                           <>
//                             <option value="partial">Partial</option>
//                             <option value="dispatched">Dispatched</option>
//                           </>
//                         )}
//                         {user?.user_type === "accountant" && (
//                           <option value="posted">Posted</option>
//                         )}
//                         {user?.user_type === "admin" &&
//                           editOrder?.status === "dispatched" && (
//                             <option value="posted">Posted</option>
//                           )}
//                         {user?.user_type === "admin" &&
//                           editOrder?.status === "approved" && (
//                             <>
//                               <option value="partial">Partial</option>
//                               <option value="dispatched">Dispatched</option>
//                             </>
//                           )}
//                       </select>
//                     </div>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
//                   <button
//                     onClick={closeEditModal}
//                     className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleEditSave}
//                     disabled={editSaving}
//                     className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-60 flex items-center justify-center gap-2"
//                   >
//                     {editSaving ? (
//                       <Loader2 size={14} className="animate-spin" />
//                     ) : (
//                       <Save size={14} />
//                     )}
//                     {editSaving ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <div className="flex items-center justify-between gap-2 mb-4">
//         <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
//           Orders
//         </h1>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <div className="relative hidden md:block w-52">
//             <Search
//               size={14}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search order #"
//               className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
//             />
//           </div>
//           {!(isDispatcher || isManager || user?.user_type === "accountant") && (
//             <button
//               onClick={() => router.push("/orders/add")}
//               className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
//             >
//               <Plus size={14} />
//               <span className="hidden sm:inline">Add Order</span>
//               <span className="sm:hidden">Add</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Search mobile */}
//       <div className="relative md:hidden mb-3">
//         <Search
//           size={14}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search order #"
//           className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none"
//         />
//       </div>

//       {/* ── DESKTOP TABLE ── */}
//       <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[800px] text-sm">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
//                 <th className="py-3 px-4 text-left font-medium">Order #</th>
//                 <th className="py-3 px-4 text-left font-medium">Dealer</th>
//                 <th className="py-3 px-4 text-left font-medium">Created By</th>
//                 <th className="py-3 px-4 text-left font-medium">Total</th>
//                 <th className="py-3 px-4 text-left font-medium">Discount</th>
//                 <th className="py-3 px-4 text-left font-medium">Status</th>
//                 <th className="py-3 px-4 text-left font-medium">Due Date</th>
//                 <th className="py-3 px-4 text-center font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedOrders?.map((o: any, i: number) => {
//                 const formattedStatus = formatStatus(o?.status);
//                 return (
//                   <tr
//                     key={o._id || i}
//                     className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
//                   >
//                     <td className="py-3 px-4 font-medium">{o?.order_number}</td>
//                     <td className="py-3 px-4 text-gray-600">
//                       {o?.dealer_id?.name}
//                     </td>
//                     <td className="py-3 px-4 text-gray-600">
//                       {o?.created_by?.name} (
//                       {o?.created_by?.user_type === "admin"
//                         ? "Director"
//                         : "Salesman"}
//                       )
//                     </td>
//                     <td className="py-3 px-4 text-gray-600">{o?.total}</td>
//                     <td className="py-3 px-4 text-gray-600">{o?.discount}</td>
//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2.5 py-1 text-xs rounded-lg font-medium ${statusStyle[formattedStatus]}`}
//                       >
//                         {formattedStatus}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-gray-500 text-xs">
//                       {o?.due_date
//                         ? new Date(o.due_date).toLocaleDateString("en-GB")
//                         : "-"}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           const rect = e.currentTarget.getBoundingClientRect();
//                           setMenuPosition({
//                             top: rect.bottom,
//                             left: Math.min(rect.left, window.innerWidth - 190),
//                           });
//                           setOpenMenu(o._id);
//                         }}
// className={actionTriggerCls}                      >
//                         <MoreVertical size={15} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//               {paginatedOrders?.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="text-center py-10 text-gray-400 text-sm"
//                   >
//                     No orders found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         {/* Pagination */}
//         <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
//           <span>
//             Showing {paginatedOrders?.length || 0} of {filtered?.length || 0}{" "}
//             orders
//           </span>
//           {totalPages > 1 && (
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-2.5 py-1 border rounded-lg ${currentPage === page ? "bg-gray-900 text-white border-gray-900" : "border-gray-200"}`}
//                   >
//                     {page}
//                   </button>
//                 ),
//               )}
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(p + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── MOBILE CARDS ── */}
//       <div className="md:hidden space-y-2">
//         {paginatedOrders?.map((o: any, i: number) => {
//           const formattedStatus = formatStatus(o?.status);
//           return (
//             <div
//               key={o._id || i}
//               className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3"
//             >
//               <div className="flex items-start justify-between gap-2">
//                 <div className="min-w-0">
//                   <p className="font-semibold text-gray-900 text-sm truncate">
//                     {o?.order_number}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate">
//                     {o?.dealer_id?.name || "—"}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     {o?.created_by?.name} ·{" "}
//                     {o?.created_by?.user_type === "admin"
//                       ? "Director"
//                       : "Salesman"}
//                   </p>
//                 </div>
//                 <div className="flex flex-col items-end gap-2 flex-shrink-0">
//                   <span
//                     className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusStyle[formattedStatus]}`}
//                   >
//                     {formattedStatus}
//                   </span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       const rect = e.currentTarget.getBoundingClientRect();
//                       setMenuPosition({
//                         top: rect.bottom + window.scrollY + 4,
//                         left: Math.min(rect.left, window.innerWidth - 190),
//                       });
//                       setOpenMenu(o._id);
//                     }}
//                     className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
//                   >
//                     <MoreVertical size={14} />
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
//                 <div className="flex gap-3 text-xs text-gray-500">
//                   <span>
//                     Total:{" "}
//                     <span className="font-medium text-gray-800">
//                       {o?.total}
//                     </span>
//                   </span>
//                   <span>
//                     Disc:{" "}
//                     <span className="font-medium text-gray-800">
//                       {o?.discount}
//                     </span>
//                   </span>
//                 </div>
//                 <span className="text-xs text-gray-400">
//                   {o?.due_date
//                     ? new Date(o.due_date).toLocaleDateString("en-GB")
//                     : "-"}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//         {paginatedOrders?.length === 0 && (
//           <div className="py-10 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
//             No orders found
//           </div>
//         )}
//         {/* Mobile pagination */}
//         <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
//           <span>
//             {paginatedOrders?.length || 0} of {filtered?.length || 0}
//           </span>
//           {totalPages > 1 && (
//             <div className="flex gap-1">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
//               >
//                 Prev
//               </button>
//               <span className="px-2.5 py-1 bg-gray-900 text-white rounded-lg">
//                 {currentPage}/{totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(p + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── DROPDOWN MENU ── */}
//       {openMenu &&
//         (() => {
//           const selectedOrder = filtered?.find(
//             (item: any) => item._id === openMenu,
//           );
//           if (!selectedOrder) return null;
//           return (
//             <div
//               style={{
//                 position: "fixed",
//                 top: menuPosition.top,
//                 left: menuPosition.left,
//                 zIndex: 9999,
//               }}
// className="dropdown-menu w-56 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-sm"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() => {
//                   handleView(selectedOrder._id);
//                   setOpenMenu(null);
//                 }}
//                 className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//               >
//                 View
//               </button>
//               <button
//                 onClick={() => {
//                   handleHistory(selectedOrder);
//                   setOpenMenu(null);
//                 }}
//                 className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//               >
//                 <History size={14} />
//                 History
//               </button>
//               {/* {selectedOrder.status !== "unapproved" &&
//                 selectedOrder.status !== "rejected" && (
//                   <button
//                     onClick={async () => {
//                       const blob = await order.downloadPDF(selectedOrder._id);
//                       const url = window.URL.createObjectURL(blob);
//                       const a = document.createElement("a");
//                       a.href = url;
//                       a.download = `order-${selectedOrder.order_number}.pdf`;
//                       a.click();
//                       window.URL.revokeObjectURL(url);
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//                   >
//                     Download PDF
//                   </button>
//                 )} */}

// {canShareOrder(selectedOrder) && (
//   <>
//     <div className="my-1 border-t border-gray-100" />

//     <button
//       onClick={() => handleShareOrder(selectedOrder, "text")}
//       className={menuItemCls}
//     >
//       <Share2 size={15} className={menuIconCls} />
//       Share Text
//     </button>

//     <button
//       onClick={() => handleShareOrder(selectedOrder, "prepare-pdf")}
//       className={menuItemCls}
//     >
//       <FileText size={15} className={menuIconCls} />
//       {pdfPreparingId === selectedOrder._id ? "Preparing PDF..." : "Prepare PDF"}
//     </button>

//     <button
//       onClick={() => handleShareOrder(selectedOrder, "share-ready-pdf")}
//       disabled={!preparedPdfFile}
//       className={menuItemCls}
//     >
//       <Share2 size={15} className={menuIconCls} />
//       Share Ready PDF
//     </button>

//     <button
//       onClick={() => handleShareOrder(selectedOrder, "download")}
//       className={menuItemCls}
//     >
//       <Download size={15} className={menuIconCls} />
//       Download PDF
//     </button>
//   </>
// )}
//               {user?.user_type === "admin" &&
//                 selectedOrder.status !== "posted" && (
// <button
//   onClick={() => {
//     handleEdit(selectedOrder._id);
//     setOpenMenu(null);
//   }}
//   className={menuItemCls}
// >
//   <Pencil size={15} className={menuIconCls} />
//   Edit
// </button>
//                 )}
//               {user?.user_type === "salesman" &&
//                 (selectedOrder.status === "unapproved" ||
//                   selectedOrder.status === "approved" ||
//                   selectedOrder.status === "rejected") &&
//                 selectedOrder?.created_by?._id === user?._id && (
//                   <button
//                     onClick={() => {
//                       handleEdit(selectedOrder._id);
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//                   >
//                     Edit
//                   </button>
//                 )}
//               {(isDispatcher || isManager) &&
//                 (selectedOrder.status === "approved" ||
//                   selectedOrder.status === "partial" ||
//                   selectedOrder.status === "dispatched") && (
//                   <button
//                     onClick={() => {
//                       handleEdit(selectedOrder._id);
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//                   >
//                     Edit
//                   </button>
//                 )}
//               {user?.user_type === "accountant" &&
//                 selectedOrder.status === "dispatched" && (
//                   <button
//                     onClick={() => {
//                       handleEdit(selectedOrder._id);
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
//                   >
//                     Edit
//                   </button>
//                 )}
//               {user?.user_type === "admin" &&
//                 (selectedOrder.status === "unapproved" ||
//                   selectedOrder.status === "rejected") && (
//                   <button
//                     onClick={() => {
//                       handleAction(selectedOrder._id, "approve");
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 text-green-600 hover:bg-gray-50 text-sm"
//                   >
//                     Approve
//                   </button>
//                 )}
//               {user?.user_type === "admin" &&
//                 selectedOrder.status === "approved" && (
//                   <button
//                     onClick={() => {
//                       handleAction(selectedOrder._id, "unapprove");
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 text-yellow-600 hover:bg-gray-50 text-sm"
//                   >
//                     Unapprove
//                   </button>
//                 )}
//               {user?.user_type === "admin" &&
//                 selectedOrder.status !== "rejected" &&
//                 selectedOrder.status !== "dispatched" &&
//                 selectedOrder.status !== "posted" && (
//                   <button
//                     onClick={() => {
//                       handleAction(selectedOrder._id, "reject");
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 text-sm"
//                   >
//                     Reject
//                   </button>
//                 )}
//               {user?.user_type === "admin" &&
//                 (selectedOrder.status === "approved" ||
//                   selectedOrder.status === "unapproved" ||
//                   selectedOrder.status === "rejected") && (
//                   <button
//                     onClick={() => {
//                       handleAction(selectedOrder._id, "delete");
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm"
//                   >
//                     Delete
//                   </button>
//                 )}
//               {user?.user_type === "salesman" &&
//                 selectedOrder.status === "unapproved" &&
//                 selectedOrder?.created_by?._id === user?._id && (
//                   <button
//                     onClick={() => {
//                       handleAction(selectedOrder._id, "reject");
//                       setOpenMenu(null);
//                     }}
//                     className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm"
//                   >
//                     Delete
//                   </button>
//                 )}
//             </div>
//           );
//         })()}
//     </div>
//   );
// }


"use client";

import { order } from "@/app/components/services/orderService";
import AuditLogService from "@/app/components/services/AuditLogService";
import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useOrders } from "@/hooks/useOrders";

import {
  Check,
  X,
  Eye,
  Plus,
  Download,
  Search,
  Pencil,
  MoreVertical,
  Save,
  Loader2,
  History,
  Trash2,
  Share2,
  FileText,
} from "lucide-react";
import {
  shareOrderText,
  prepareOrderPdfFile,
  sharePreparedPdfFile,
  downloadOrderPdf,
} from "@/app/components/lib/orderShareUtils";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const statusStyle: any = {
  Pending: "bg-yellow-100 text-yellow-600",
  Unapproved: "bg-gray-100 text-blue-600",
  Rejected: "bg-red-100 text-red-600",
  Posted: "bg-green-100 text-green-600",
  Approved: "bg-yellow-100 text-yellow-600",
  Dispatched: "bg-blue-100 text-blue-600",
  Partial: "bg-orange-100 text-orange-600",
};

function OrdersPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const user = useSelector((state: any) => state.user.user);
  const isDispatcher = user?.user_type === "dispatcher";
  const isManager = user?.user_type === "manager";
  const canEditFull =
    user?.user_type === "admin" || user?.user_type === "salesman";
  const { data: categories = [] } = useCategory(user?.industry);
  const { data, refetch } = useOrders(user?.industry);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "unapprove" | "delete" | null
  >(null);
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [historyOrder, setHistoryOrder] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [editOrder, setEditOrder] = useState<any>(null);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [productMap, setProductMap] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [preparedPdfFile, setPreparedPdfFile] = useState<File | null>(null);
  const [preparedPdfOrder, setPreparedPdfOrder] = useState<any>(null);
  const [pdfPreparingId, setPdfPreparingId] = useState<string | null>(null);
  const [deleteEditItemConfirm, setDeleteEditItemConfirm] = useState<{
    index: number;
    item: any;
  } | null>(null);
  const { data: dealer } = useDealers(user?.industry);
  const dealers = dealer?.dealers || [];
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const ORDERS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if ((e.target as HTMLElement).closest(".dropdown-menu")) return;
      setOpenMenu(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const newMap: any = { ...productMap };
      for (const item of editItems) {
        if (item.category_id && !newMap[item.category_id]) {
          const res = await order.getProductsByCategory(item.category_id);
          newMap[item.category_id] = res?.products || res || [];
        }
      }
      setProductMap(newMap);
    };
    if (editItems.length > 0) loadProducts();
  }, [editItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    let result = data || [];
    if (search.trim())
      result = result?.filter((o: any) =>
        o?.order_number?.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [search, data]);

  const totalPages = Math.ceil((filtered?.length || 0) / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return filtered?.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [filtered, currentPage]);

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
  const getRoleKey = (person: any) => {
    return String(person?.user_type || person?.role || "").toLowerCase();
  };

  const getRoleLabel = (person: any) => {
    const role = getRoleKey(person);

    if (role === "admin") return "Director";
    if (role === "salesman") return "Salesman";
    if (role === "dispatcher") return "Dispatcher";
    if (role === "manager") return "Manager";
    if (role === "accountant") return "Accountant";
    if (role === "super_admin") return "Super Admin";

    return "User";
  };

  const getCreatedByText = (createdBy: any) => {
    if (!createdBy?.name) return "-";
    return `${createdBy.name} (${getRoleLabel(createdBy)})`;
  };

  const getPerformedByText = (log: any) => {
    const name = log?.performedBy?.name || log?.performedByName || "System";

    const role =
      log?.performedBy?.user_type ||
      log?.performedBy?.role ||
      log?.performedByRole ||
      "";

    if (!role) return name;

    return `${name} (${getRoleLabel({ user_type: role })})`;
  };
  const hiddenAuditFields = [
    "_id",
    "businessId",
    "created_by",
    "updated_by",
    "dealer_id",
    "__v",
  ];

  const formatAuditField = (field: string) => {
    const labels: any = {
      order_number: "Order Number",
      payment_term: "Payment Term",
      due_date: "Due Date",
      deliveryNotes: "Delivery Notes",
      status: "Status",
      rejectReason: "Reject Reason",
      subtotal: "Subtotal",
      total: "Total",
      discount: "Discount",
      tax: "Tax",
    };

    return labels[field] || field.replaceAll("_", " ");
  };

  const formatAuditValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString("en-GB");
    }

    if (typeof value === "object") {
      if (value?.name) return value.name;
      if (value?.businessName) return value.businessName;
      if (value?.order_number) return value.order_number;
      return "-";
    }

    return String(value);
  };
  const getItemName = (item: any) => {
    return (
      item?.item_name || item?.product_id?.name || item?.product_name || "Item"
    );
  };

  const getItemSignature = (item: any) => {
    return String(
      item?.product_id?._id || item?.product_id || item?.item_name || item?._id,
    );
  };

  const getItemChanges = (oldItems: any[] = [], newItems: any[] = []) => {
    const changes: any[] = [];

    const oldMap = new Map();
    const newMap = new Map();

    oldItems.forEach((item) => {
      oldMap.set(getItemSignature(item), item);
    });

    newItems.forEach((item) => {
      newMap.set(getItemSignature(item), item);
    });

    newItems.forEach((newItem) => {
      const key = getItemSignature(newItem);
      const oldItem = oldMap.get(key);

      if (!oldItem) {
        changes.push({
          type: "ADDED",
          text: `${getItemName(newItem)} added`,
        });
        return;
      }

      if (Number(oldItem.quantity) !== Number(newItem.quantity)) {
        changes.push({
          type: "UPDATED",
          text: `${getItemName(newItem)} quantity changed ${oldItem.quantity} → ${newItem.quantity}`,
        });
      }

      if (Number(oldItem.unit_price) !== Number(newItem.unit_price)) {
        changes.push({
          type: "UPDATED",
          text: `${getItemName(newItem)} price changed ${oldItem.unit_price} → ${newItem.unit_price}`,
        });
      }

      if (
        Number(oldItem.discount_percent) !== Number(newItem.discount_percent)
      ) {
        changes.push({
          type: "UPDATED",
          text: `${getItemName(newItem)} discount changed ${oldItem.discount_percent} → ${newItem.discount_percent}`,
        });
      }

      if (Number(oldItem.total) !== Number(newItem.total)) {
        changes.push({
          type: "UPDATED",
          text: `${getItemName(newItem)} total changed ${oldItem.total} → ${newItem.total}`,
        });
      }
    });

    oldItems.forEach((oldItem) => {
      const key = getItemSignature(oldItem);

      if (!newMap.has(key)) {
        changes.push({
          type: "REMOVED",
          text: `${getItemName(oldItem)} removed`,
        });
      }
    });

    return changes;
  };
  const handleAction = (
    orderId: string,
    action: "approve" | "reject" | "unapprove" | "delete",
  ) => {
    setConfirmOrderId(orderId);
    setConfirmAction(action);
    if (action === "reject") setRejectReason("");
  };

  const handleConfirm = async () => {
    if (confirmAction === "approve") {
      const res = await order.updateStatus(confirmOrderId, {
        status: "approved",
      });
      if (!res.success)
        return toast.error(res?.message || "Problem approving order");
      toast.success(res?.message);
      await refetch();
    } else if (confirmAction === "delete") {
      const res = await order.deleteOrder(confirmOrderId);
      if (!res.success)
        return toast.error(res?.message || "Problem deleting order");
      toast.success(res?.message || "Order deleted");
      await refetch();
    } else if (confirmAction === "unapprove") {
      const res = await order.updateStatus(confirmOrderId, {
        status: "unapproved",
      });
      if (!res.success)
        return toast.error(res?.message || "Problem unapproving order");
      toast.success(res?.message || "Order unapproved successfully");
      await refetch();
    } else if (confirmAction === "reject") {
      if (user?.user_type === "salesman") {
        const res = await order.deleteOrder(confirmOrderId);
        if (!res.success)
          return toast.error(res?.message || "Problem deleting order");
        toast.success(res?.message);
      } else {
        const res = await order.updateStatus(confirmOrderId, {
          status: "rejected",
          rejectReason,
        });
        if (!res.success)
          return toast.error(res?.message || "Problem rejecting order");
        toast.success(res?.message);
      }
      await refetch();
    }
    setConfirmOrderId(null);
    setConfirmAction(null);
  };

  const handleView = async (orderId: string) => {
    setViewLoading(true);

    try {
      const res = await order.getOrderById(orderId);

      if (!res.success) {
        return toast.error(res?.message || "Failed to load order");
      }

      setViewOrder(res.order);
      setViewItems(res.items || []);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setViewLoading(false);
    }
  };

  const handleShareOrder = async (
    selectedOrder: any,
    type: "text" | "prepare-pdf" | "share-ready-pdf" | "download",
  ) => {
    try {
      setOpenMenu(null);

      const res = await order.getOrderById(selectedOrder._id);

      if (!res?.success) {
        return toast.error(res?.message || "Failed to load order");
      }

      if (type === "text") {
        const result = await shareOrderText(res.order, res.items || []);

        if (!result.success && !result.cancelled) {
          toast.error(result.message || "Share failed");
        }

        if (result?.message && result.success) {
          toast.success(result.message);
        }

        return;
      }

      if (type === "prepare-pdf") {
        setPdfPreparingId(selectedOrder._id);
        toast.loading("Preparing PDF...", { id: "prepare-pdf" });

        const file = await prepareOrderPdfFile(res.order);

        setPreparedPdfFile(file);
        setPreparedPdfOrder(res.order);

        toast.dismiss("prepare-pdf");
        toast.success("PDF ready. Now click Share Ready PDF.");

        return;
      }

      if (type === "share-ready-pdf") {
        if (!preparedPdfFile || !preparedPdfOrder) {
          return toast.error("Please prepare PDF first");
        }

        const result = await sharePreparedPdfFile(
          preparedPdfOrder,
          preparedPdfFile,
        );

        if (!result.success && !result.cancelled) {
          return toast.error(result.message || "PDF share failed");
        }

        if (result.success) {
          toast.success("PDF shared");
        }

        return;
      }

      if (type === "download") {
        const result = await downloadOrderPdf(res.order);

        if (!result.success) {
          return toast.error(result.message || "PDF download failed");
        }

        toast.success("PDF downloaded");
      }
    } catch (error: any) {
      toast.dismiss("prepare-pdf");
      toast.error(error?.message || "Action failed");
    } finally {
      setPdfPreparingId(null);
    }
  };
  const handleHistory = async (selectedOrder: any) => {
    setHistoryOrder(selectedOrder);
    setHistoryLoading(true);
    setAuditLogs([]);

    try {
      const logsRes = await AuditLogService.getEntityAuditLogs(
        "ORDER",
        selectedOrder._id,
      );

      if (logsRes?.success) {
        setAuditLogs(logsRes?.data || []);
      } else {
        setAuditLogs([]);
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleEdit = async (orderId: string) => {
    setEditLoading(true);
    setEditOrder({ _placeholder: true });
    try {
      const res = await order.getOrderById(orderId);
      if (!res.success) {
        setEditOrder(null);
        return toast.error(res?.message || "Failed to load order");
      }
      setEditOrder(res.order);
      setEditItems(
        res.items.map((item: any) => ({
          ...item,
          product_id: item.product_id || "",
          category_id: item.category_id || "",
          discount_type: item.discount_type || "percent",
        })),
      );
      setEditFields({
        due_date: res.order?.due_date
          ? new Date(res.order.due_date).toISOString().split("T")[0]
          : "",
        deliveryNotes: res.order?.deliveryNotes || "",
        payment_term: res.order?.payment_term || "cash",
        discount_type: res.order?.discount_type || "amount",
        tax_type: res.order?.tax_type || "amount",
        dealer_id: res.order?.dealer_id?._id || "",
        discount:
          res.order?.discount_type === "percent"
            ? res.order?.subtotal > 0
              ? ((res.order.discount / res.order.subtotal) * 100).toFixed(2)
              : 0
            : res.order?.discount || 0,
        tax:
          res.order?.tax_type === "percent"
            ? res.order?.subtotal - res.order?.discount > 0
              ? (
                  (res.order.tax / (res.order.subtotal - res.order.discount)) *
                  100
                ).toFixed(2)
              : 0
            : res.order?.tax || 0,
      });
    } catch {
      setEditOrder(null);
      toast.error("Failed to load order details");
    } finally {
      setEditLoading(false);
    }
  };

  const round2 = (value: any) => {
    return Math.round((Number(value) || 0) * 100) / 100;
  };

  const normalizeAmountType = (type: any, defaultType = "amount") => {
    const value = String(type || "").toLowerCase();

    if (value === "percent" || value === "percentage") return "percent";
    if (value === "amount" || value === "fixed") return "amount";

    return defaultType;
  };

  const calculateEditItemTotal = (item: any) => {
    const qty = Number(item?.quantity || 0);
    const price = Number(item?.unit_price || 0);
    const discount = Number(item?.discount_percent || 0);
    const discountType = normalizeAmountType(item?.discount_type, "percent");

    const gross = qty * price;
    const discountAmount =
      discountType === "amount" ? discount : (gross * discount) / 100;

    return round2(Math.max(gross - discountAmount, 0));
  };

  const isEditItemFilled = (item: any) => {
    return Boolean(
      item?.category_id ||
      item?.product_id ||
      String(item?.item_name || "").trim() ||
      Number(item?.unit_price || 0) > 0 ||
      Number(item?.discount_percent || 0) > 0 ||
      Number(item?.total || 0) > 0 ||
      Number(item?.quantity || 1) > 1,
    );
  };

  const handleEditItemChange = (index: number, field: string, value: any) => {
    setEditItems((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: ["quantity", "unit_price", "discount_percent"].includes(field)
          ? value === ""
            ? 0
            : Number(value)
          : value,
      };

      updated[index].discount_type = normalizeAmountType(
        updated[index].discount_type,
        "percent",
      );

      updated[index].total = calculateEditItemTotal(updated[index]);

      return updated;
    });
  };

  const handleAddItem = () =>
    setEditItems((prev) => [
      ...prev,
      {
        category_id: "",
        product_id: "",
        item_name: "",
        quantity: 1,
        unit_price: 0,
        discount_percent: 0,
        discount_type: "percent",
        total: 0,
      },
    ]);

  const handleRemoveItem = (index: number) => {
    const item = editItems[index];

    if (!isEditItemFilled(item)) {
      setEditItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setDeleteEditItemConfirm({ index, item });
  };

  const handleConfirmEditItemDelete = () => {
    if (!deleteEditItemConfirm) return;

    const { index, item } = deleteEditItemConfirm;

    setEditItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`${getItemName(item)} removed`);
    setDeleteEditItemConfirm(null);
  };

  const computedTotals = useMemo(() => {
    const itemsSubtotal = round2(
      editItems.reduce((sum, item) => sum + calculateEditItemTotal(item), 0),
    );

    const discountInput = Math.max(Number(editFields.discount) || 0, 0);
    const taxInput = Math.max(Number(editFields.tax) || 0, 0);

    const discountType = normalizeAmountType(
      editFields.discount_type,
      "amount",
    );
    const taxType = normalizeAmountType(editFields.tax_type, "amount");

    const rawDiscountAmt =
      discountType === "percent"
        ? round2((itemsSubtotal * discountInput) / 100)
        : round2(discountInput);

    // Discount should never make the subtotal negative.
    const discountAmt = round2(Math.min(rawDiscountAmt, itemsSubtotal));
    const taxable = round2(Math.max(itemsSubtotal - discountAmt, 0));

    const taxAmt =
      taxType === "percent"
        ? round2((taxable * taxInput) / 100)
        : round2(taxInput);

    return {
      subtotal: itemsSubtotal,
      discountAmt,
      taxable,
      taxAmt,
      total: round2(Math.max(taxable + taxAmt, 0)),
    };
  }, [editItems, editFields]);

  const handleEditSave = async () => {
    setEditSaving(true);
    let payload: any;

    if (isDispatcher || isManager) {
      if (!editOrder?.status) {
        setEditSaving(false);
        return toast.error("Status is required");
      }

      payload = {
        status: editOrder?.status,
        deliveryNotes: editFields.deliveryNotes,
        payment_term: editFields.payment_term,
      };
    } else if (user?.user_type === "accountant") {
      if (!editOrder?.status) {
        setEditSaving(false);
        return toast.error("Status is required");
      }

      payload = {
        status: editOrder?.status,
        payment_term: editFields.payment_term,
      };
    } else if (canEditFull) {
      const validEditItems = editItems.filter(isEditItemFilled);

      if (validEditItems.length === 0) {
        setEditSaving(false);
        return toast.error("Please add at least one valid item");
      }

      payload = {
        due_date: editFields.due_date,
        deliveryNotes: editFields.deliveryNotes,
        payment_term: editFields.payment_term,
        // Store the calculated amounts, not the raw percentage input.
        // Example: subtotal 1000, discount 10% => discount saved as 100.
        discount: computedTotals.discountAmt,
        discount_type: normalizeAmountType(editFields.discount_type, "amount"),
        tax: computedTotals.taxAmt,
        dealer_id: editFields.dealer_id,
        tax_type: normalizeAmountType(editFields.tax_type, "amount"),
        items: validEditItems.map((item) => ({
          _id: item._id,
          product_id: item.product_id?._id || item.product_id || null,
          category_id: item.category_id?._id || item.category_id || null,
          quantity: Number(item.quantity) || 1,
          item_name: item?.item_name,
          unit_price: Number(item.unit_price) || 0,
          discount_percent: Number(item.discount_percent) || 0,
          discount_type: normalizeAmountType(item.discount_type, "percent"),
          total: calculateEditItemTotal(item),
        })),
        subtotal: computedTotals.subtotal,
        total: computedTotals.total,
        status: editOrder?.status,
      };
    }

    const res = await order.updateOrder(payload, editOrder?._id);

    if (!res.success) {
      setEditSaving(false);
      return toast.error(res?.message || "Failed to update order");
    }

    toast.success(res?.message || "Order updated successfully");
    closeEditModal();
    setEditSaving(false);
    await refetch();
  };

  const closeEditModal = () => {
    setEditOrder(null);
    setEditItems([]);
    setEditFields({});
    setDeleteEditItemConfirm(null);
  };

  const isGeneralCategory = (categoryId: any) => {
    const cat = categories.find((c: any) => c._id === categoryId);
    return cat?.name === "General Appliances";
  };


  const getStatusKey = (status: any) => String(status || "").toLowerCase();

  const isOwnOrder = (selectedOrder: any) =>
    String(selectedOrder?.created_by?._id) === String(user?._id);

  const canShareOrder = (selectedOrder: any) => {
    const status = getStatusKey(selectedOrder?.status);

    // Salesman can share only his own approved order.
    if (user?.user_type === "salesman") {
      return status === "approved" && isOwnOrder(selectedOrder);
    }

    return ["approved", "partial", "dispatched", "posted"].includes(status);
  };

  const canEditOrder = (selectedOrder: any) => {
    const status = getStatusKey(selectedOrder?.status);

    if (user?.user_type === "admin") return status !== "posted";

    if (user?.user_type === "salesman") {
      return (
        isOwnOrder(selectedOrder) &&
        ["unapproved", "approved", "rejected"].includes(status)
      );
    }

    if (isDispatcher || isManager) {
      return ["approved", "partial", "dispatched"].includes(status);
    }

    if (user?.user_type === "accountant") return status === "dispatched";

    return false;
  };

  const canApproveOrder = (selectedOrder: any) =>
    user?.user_type === "admin" &&
    ["unapproved", "rejected"].includes(getStatusKey(selectedOrder?.status));

  const canUnapproveOrder = (selectedOrder: any) =>
    user?.user_type === "admin" && getStatusKey(selectedOrder?.status) === "approved";

  const canRejectOrder = (selectedOrder: any) => {
    const status = getStatusKey(selectedOrder?.status);

    return (
      user?.user_type === "admin" &&
      !["rejected", "dispatched", "posted"].includes(status)
    );
  };

  const canDeleteOrder = (selectedOrder: any) => {
    const status = getStatusKey(selectedOrder?.status);

    if (user?.user_type === "admin") {
      return ["approved", "unapproved", "rejected"].includes(status);
    }

    return (
      user?.user_type === "salesman" &&
      status === "unapproved" &&
      isOwnOrder(selectedOrder)
    );
  };

  const getActionMenuLeft = (left: number, width = 224) =>
    Math.max(8, Math.min(left, window.innerWidth - width - 8));

  const actionTriggerCls =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-900 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20";

  const menuItemCls =
    "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-900 hover:text-white hover:shadow-md disabled:pointer-events-none disabled:opacity-40";

  const menuSuccessCls =
    "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-green-600 transition-all duration-200 hover:bg-green-50 hover:text-green-700 hover:shadow-sm disabled:pointer-events-none disabled:opacity-40";

  const menuWarningCls =
    "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-yellow-600 transition-all duration-200 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow-sm disabled:pointer-events-none disabled:opacity-40";

  const menuDangerCls =
    "group flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:shadow-sm disabled:pointer-events-none disabled:opacity-40";

  const menuIconCls =
    "shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-white";

  const menuSuccessIconCls =
    "shrink-0 text-green-500 transition-colors duration-200 group-hover:text-green-700";

  const menuWarningIconCls =
    "shrink-0 text-yellow-500 transition-colors duration-200 group-hover:text-yellow-700";

  const menuDangerIconCls =
    "shrink-0 text-red-400 transition-colors duration-200 group-hover:text-red-600";
  const isFinancialLocked =
    isDispatcher ||
    isManager ||
    user?.user_type === "accountant" ||
    editOrder?.status === "dispatched" ||
    editOrder?.status === "posted";

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white";
  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">
      {/* ── CONFIRM MODAL ── */}
      {confirmOrderId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              {confirmAction === "delete"
                ? "Delete Order?"
                : confirmAction === "approve"
                  ? "Approve Order?"
                  : confirmAction === "unapprove"
                    ? "Unapprove Order?"
                    : user?.user_type === "salesman"
                      ? "Delete Order?"
                      : "Reject Order?"}
            </h2>
            {confirmAction === "reject" && user?.user_type !== "salesman" && (
              <div className="mb-3">
                <label className={labelCls}>
                  Reject Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Write reason for rejection..."
                  className={`${inputCls} resize-none`}
                  rows={3}
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mb-4">
              {confirmAction === "delete"
                ? "Are you sure you want to permanently delete this order?"
                : confirmAction === "approve"
                  ? "Are you sure you want to approve this order?"
                  : confirmAction === "unapprove"
                    ? "Move this order back to unapproved?"
                    : `Are you sure you want to ${user?.user_type === "admin" ? "reject" : "delete"} this order?`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmOrderId(null);
                  setConfirmAction(null);
                }}
                className="px-3 py-1.5 rounded-lg border text-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={
                  confirmAction === "reject" &&
                  user?.user_type !== "salesman" &&
                  !rejectReason.trim()
                }
                className={`px-3 py-1.5 rounded-lg text-white text-sm disabled:opacity-50 ${confirmAction === "approve" ? "bg-green-500" : confirmAction === "unapprove" ? "bg-yellow-500" : "bg-red-500"}`}
              >
                {confirmAction === "delete"
                  ? "Delete"
                  : confirmAction === "approve"
                    ? "Approve"
                    : confirmAction === "unapprove"
                      ? "Unapprove"
                      : user?.user_type === "salesman"
                        ? "Delete"
                        : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteEditItemConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
              Delete Item
            </h2>

            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-800">
                {getItemName(deleteEditItemConfirm.item)}
              </span>
              ?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteEditItemConfirm(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmEditItemDelete}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {historyOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Order History
                </h2>
                <p className="text-xs text-gray-400">
                  {historyOrder?.order_number}
                </p>
              </div>

              <button
                onClick={() => {
                  setHistoryOrder(null);
                  setAuditLogs([]);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {historyLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                  Loading history...
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No history found
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log: any, i: number) => (
                    <div
                      key={log?._id || i}
                      className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-gray-800">
                          {String(log.action || "").replaceAll("_", " ")}
                        </p>

                        <p className="text-gray-400">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "-"}
                        </p>
                      </div>

                      <p className="text-gray-500">
                        {log.description || "Action performed"}
                      </p>

                      <p className="text-gray-400 mt-1">
                        by {getPerformedByText(log)}
                      </p>

                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(log.changes)
                            .filter(
                              ([field]) => !hiddenAuditFields.includes(field),
                            )
                            .slice(0, 8)
                            .map(([field, value]: any) => (
                              <p key={field} className="text-gray-500">
                                <span className="font-medium">
                                  {formatAuditField(field)}
                                </span>
                                : <span>{formatAuditValue(value?.from)}</span>
                                {" → "}
                                <span>{formatAuditValue(value?.to)}</span>
                              </p>
                            ))}
                        </div>
                      )}

                      {log?.meta?.oldItems && log?.meta?.newItems && (
                        <div className="mt-2 space-y-1">
                          {getItemChanges(log.meta.oldItems, log.meta.newItems)
                            .slice(0, 8)
                            .map((itemChange: any, index: number) => (
                              <p key={index} className="text-gray-500">
                                <span className="font-medium">
                                  {itemChange.type}
                                </span>
                                : {itemChange.text}
                              </p>
                            ))}
                        </div>
                      )}

                      {log?.meta?.items && log?.meta?.items?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {log.meta.items
                            .slice(0, 8)
                            .map((item: any, index: number) => (
                              <p key={index} className="text-gray-500">
                                <span className="font-medium">ADDED</span>:{" "}
                                {getItemName(item)} added
                              </p>
                            ))}
                        </div>
                      )}

                      {log?.meta?.deletedItems &&
                        log?.meta?.deletedItems?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {log.meta.deletedItems
                              .slice(0, 8)
                              .map((item: any, index: number) => (
                                <p key={index} className="text-gray-500">
                                  <span className="font-medium">REMOVED</span>:{" "}
                                  {getItemName(item)} removed
                                </p>
                              ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {(viewOrder || viewLoading) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
            {viewLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {viewOrder?.order_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(viewOrder?.status)]}`}
                    >
                      {formatStatus(viewOrder?.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setViewOrder(null);
                      setViewItems([]);
                      setAuditLogs([]);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Dealer</p>
                      <p className="text-sm font-medium">
                        {viewOrder?.dealer_id?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 mb-0.5">
                        Created By
                      </p>
                      {/* <p className="text-sm">{viewOrder?.created_by?.name} ({viewOrder?.created_by?.user_type === "admin" ? "Director" : "Salesman"})</p> */}
                      <p className="text-sm">
                        {getCreatedByText(viewOrder?.created_by)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Order Date</p>
                      <p className="text-sm font-medium">
                        {viewOrder?.order_date
                          ? new Date(viewOrder.order_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 mb-0.5">
                        Due Date
                      </p>
                      <p className="text-sm font-medium">
                        {viewOrder?.due_date
                          ? new Date(viewOrder.due_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {viewOrder?.deliveryNotes && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <p className="text-xs text-yellow-600 font-medium mb-1">
                        Delivery Notes
                      </p>
                      <p className="text-sm text-gray-700">
                        {viewOrder.deliveryNotes}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Order Items
                    </p>
                    <div className="border border-gray-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-sm min-w-[380px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs">
                          <tr>
                            <th className="text-left px-3 py-2">Product</th>
                            <th className="px-3 py-2 text-center">Qty</th>
                            <th className="px-3 py-2 text-center">Price</th>
                            <th className="px-3 py-2 text-center">Disc</th>
                            <th className="px-3 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewItems.map((item: any, i: number) => (
                            <tr key={i} className="border-t border-gray-100">
                              <td className="px-3 py-2">
                                {item?.item_name || item?.product_id?.name}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {item?.quantity}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {item?.unit_price}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {item?.discount_percent}
                                {item?.discount_type === "amount"
                                  ? " Amt"
                                  : "%"}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {item?.total?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {viewOrder?.rejectReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs text-red-600 font-semibold mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-gray-700">
                        {viewOrder?.rejectReason}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{viewOrder?.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Discount</span>
                      <span>- {viewOrder?.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>+ {viewOrder?.tax}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>{viewOrder?.total}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
            {editLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading order...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      Edit — {editOrder?.order_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(editOrder?.status)]}`}
                    >
                      {formatStatus(editOrder?.status)}
                    </span>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                  {/* Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className={labelCls}>Dealer</p>
                      {isDispatcher ||
                      isManager ||
                      user?.user_type === "accountant" ? (
                        <p className="text-sm font-medium">
                          {editOrder?.dealer_id?.name}
                        </p>
                      ) : (
                        <select
                          value={editFields.dealer_id || ""}
                          onChange={(e) =>
                            setEditFields((prev: any) => ({
                              ...prev,
                              dealer_id: e.target.value,
                            }))
                          }
                          className={inputCls}
                        >
                          <option value="">Select Dealer</option>
                          {dealers.map((d: any) => (
                            <option key={d._id} value={d._id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className={`${labelCls} mt-2`}>Created By</p>
                      <p className="text-sm">
                        {editOrder?.created_by?.name} (
                        {editOrder?.created_by?.user_type === "admin"
                          ? "Director"
                          : "Salesman"}
                        )
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className={labelCls}>Order Date</p>
                      <p className="text-sm font-medium">
                        {editOrder?.order_date
                          ? new Date(editOrder.order_date).toLocaleDateString(
                              "en-GB",
                            )
                          : "-"}
                      </p>
                      <p className={`${labelCls} mt-2`}>Due Date</p>
                      <input
                        type="date"
                        value={editFields.due_date}
                        disabled={
                          isDispatcher ||
                          isManager ||
                          user?.user_type === "accountant"
                        }
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            due_date: e.target.value,
                          }))
                        }
                        className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>
                  </div>

                  {/* Payment + Delivery */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Payment Term</label>
                      <select
                        value={editFields.payment_term || "cash"}
                        disabled={isDispatcher}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            payment_term: e.target.value,
                          }))
                        }
                        className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                      >
                        <option value="cash">Cash</option>
                        <option value="advance">Advance</option>
                        <option value="periodical">Periodical</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Delivery Notes</label>
                      <textarea
                        rows={2}
                        value={editFields.deliveryNotes}
                        disabled={user?.user_type === "accountant"}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            deliveryNotes: e.target.value,
                          }))
                        }
                        placeholder="Add delivery notes..."
                        className={`${inputCls} resize-none disabled:bg-gray-100 disabled:text-gray-400`}
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order Items
                      </p>
                      {!isDispatcher &&
                        !isManager &&
                        user?.user_type !== "accountant" && (
                          <button
                            onClick={handleAddItem}
                            className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg"
                          >
                            + Add Item
                          </button>
                        )}
                    </div>

                    {/* Desktop table */}
                    {isDispatcher ||
                    isManager ||
                    user?.user_type === "accountant" ? (
                      <div className="border border-gray-200 rounded-xl overflow-x-auto">
                        <table className="w-full text-sm min-w-[380px]">
                          <thead className="bg-gray-50 text-gray-500 text-xs">
                            <tr>
                              <th className="text-left px-3 py-2">Product</th>
                              <th className="px-3 py-2 text-center">Qty</th>
                              <th className="px-3 py-2 text-center">Price</th>
                              <th className="px-3 py-2 text-center">Disc</th>
                              <th className="px-3 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editItems.map((item: any, i: number) => (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="px-3 py-2">
                                  {item?.item_name || item?.product_id?.name}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.quantity}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.unit_price}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.discount_percent}
                                  {item?.discount_type === "amount"
                                    ? " Amt"
                                    : "%"}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {item?.total?.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <>
                        {/* Desktop editable table */}
                        <div className="hidden md:block border border-gray-200 rounded-xl overflow-x-auto">
                          <table className="w-full text-sm min-w-[560px]">
                            <thead className="bg-gray-50 text-gray-500 text-xs">
                              <tr>
                                <th className="px-2 py-2 text-left">
                                  Category
                                </th>
                                <th className="px-2 py-2 text-left">Product</th>
                                <th className="px-2 py-2 text-center">Qty</th>
                                <th className="px-2 py-2 text-center">Price</th>
                                <th className="px-2 py-2 text-center">
                                  Discount
                                </th>
                                <th className="px-2 py-2 text-right">Total</th>
                                <th className="px-2 py-2 text-center">Del</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editItems?.map((item: any, i: number) => {
                                const rowProducts =
                                  productMap[item.category_id] || [];
                                return (
                                  <tr
                                    key={i}
                                    className="border-t border-gray-100"
                                  >
                                    <td className="px-1.5 py-1.5">
                                      <select
                                        value={item.category_id}
                                        onChange={async (e) => {
                                          const categoryId = e.target.value;
                                          handleEditItemChange(
                                            i,
                                            "category_id",
                                            categoryId,
                                          );
                                          handleEditItemChange(
                                            i,
                                            "product_id",
                                            "",
                                          );
                                          handleEditItemChange(
                                            i,
                                            "item_name",
                                            "",
                                          );
                                          if (!productMap[categoryId]) {
                                            const res =
                                              await order.getProductsByCategory(
                                                categoryId,
                                              );
                                            setProductMap((prev: any) => ({
                                              ...prev,
                                              [categoryId]:
                                                res?.products || res || [],
                                            }));
                                          }
                                        }}
                                        className={inputCls}
                                      >
                                        <option value="">Category</option>
                                        {categories.map((c: any) => (
                                          <option key={c._id} value={c._id}>
                                            {c.name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="px-1.5 py-1.5">
                                      {isGeneralCategory(item.category_id) ? (
                                        <input
                                          type="text"
                                          placeholder="Product name"
                                          value={item.item_name || ""}
                                          onChange={(e) => {
                                            handleEditItemChange(
                                              i,
                                              "item_name",
                                              e.target.value,
                                            );
                                            handleEditItemChange(
                                              i,
                                              "product_id",
                                              "",
                                            );
                                          }}
                                          className={inputCls}
                                        />
                                      ) : (
                                        <select
                                          value={
                                            item.product_id?._id ||
                                            item.product_id ||
                                            ""
                                          }
                                          onChange={(e) => {
                                            const product = rowProducts.find(
                                              (p: any) =>
                                                String(p._id) ===
                                                String(e.target.value),
                                            );
                                            handleEditItemChange(
                                              i,
                                              "product_id",
                                              e.target.value,
                                            );
                                            handleEditItemChange(
                                              i,
                                              "item_name",
                                              product?.name || "",
                                            );
                                            handleEditItemChange(
                                              i,
                                              "unit_price",
                                              product?.mrp || 0,
                                            );
                                          }}
                                          className={inputCls}
                                        >
                                          <option value="">Product</option>
                                          {rowProducts.map((p: any) => (
                                            <option key={p._id} value={p._id}>
                                              {p.name}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    </td>
                                    <td className="px-1.5 py-1.5">
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "quantity",
                                            e.target.value,
                                          )
                                        }
                                        className={`${inputCls} text-center`}
                                      />
                                    </td>
                                    <td className="px-1.5 py-1.5">
                                      <input
                                        type="number"
                                        value={item.unit_price}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "unit_price",
                                            e.target.value,
                                          )
                                        }
                                        readOnly={
                                          !isGeneralCategory(item.category_id)
                                        }
                                        className={`${inputCls} text-center`}
                                      />
                                    </td>
                                    <td className="px-1.5 py-1.5">
                                      <div className="flex gap-1">
                                        <select
                                          value={item.discount_type}
                                          onChange={(e) =>
                                            handleEditItemChange(
                                              i,
                                              "discount_type",
                                              e.target.value,
                                            )
                                          }
                                          className="border border-gray-200 rounded-lg px-1 py-1.5 text-xs w-14 bg-white focus:outline-none"
                                        >
                                          <option value="percent">%</option>
                                          <option value="amount">Amt</option>
                                        </select>
                                        <input
                                          type="number"
                                          value={item.discount_percent}
                                          onChange={(e) =>
                                            handleEditItemChange(
                                              i,
                                              "discount_percent",
                                              e.target.value,
                                            )
                                          }
                                          className={`${inputCls} text-center min-w-0`}
                                        />
                                      </div>
                                    </td>
                                    <td className="px-1.5 py-1.5 text-right text-xs font-medium whitespace-nowrap">
                                      {(item.total ?? 0).toFixed(2)}
                                    </td>
                                    <td className="px-1.5 py-1.5 text-center">
                                      <button
                                        onClick={() => handleRemoveItem(i)}
                                        className="p-1 bg-red-100 text-red-600 rounded-md"
                                      >
                                        <X size={13} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                          {editItems?.map((item: any, i: number) => {
                            const rowProducts =
                              productMap[item.category_id] || [];
                            return (
                              <div
                                key={i}
                                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                              >
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Item {i + 1}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveItem(i)}
                                    className="p-1.5 bg-red-100 text-red-600 rounded-lg"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                                <div className="p-3 space-y-2.5">
                                  <div>
                                    <label className={labelCls}>Category</label>
                                    <select
                                      value={item.category_id}
                                      onChange={async (e) => {
                                        const categoryId = e.target.value;
                                        handleEditItemChange(
                                          i,
                                          "category_id",
                                          categoryId,
                                        );
                                        handleEditItemChange(
                                          i,
                                          "product_id",
                                          "",
                                        );
                                        handleEditItemChange(
                                          i,
                                          "item_name",
                                          "",
                                        );
                                        if (!productMap[categoryId]) {
                                          const res =
                                            await order.getProductsByCategory(
                                              categoryId,
                                            );
                                          setProductMap((prev: any) => ({
                                            ...prev,
                                            [categoryId]:
                                              res?.products || res || [],
                                          }));
                                        }
                                      }}
                                      className={inputCls}
                                    >
                                      <option value="">Select Category</option>
                                      {categories.map((c: any) => (
                                        <option key={c._id} value={c._id}>
                                          {c.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className={labelCls}>Product</label>
                                    {isGeneralCategory(item.category_id) ? (
                                      <input
                                        type="text"
                                        placeholder="Enter product name"
                                        value={item.item_name || ""}
                                        onChange={(e) => {
                                          handleEditItemChange(
                                            i,
                                            "item_name",
                                            e.target.value,
                                          );
                                          handleEditItemChange(
                                            i,
                                            "product_id",
                                            "",
                                          );
                                        }}
                                        className={inputCls}
                                      />
                                    ) : (
                                      <select
                                        value={
                                          item.product_id?._id ||
                                          item.product_id ||
                                          ""
                                        }
                                        onChange={(e) => {
                                          const product = rowProducts.find(
                                            (p: any) =>
                                              String(p._id) ===
                                              String(e.target.value),
                                          );
                                          handleEditItemChange(
                                            i,
                                            "product_id",
                                            e.target.value,
                                          );
                                          handleEditItemChange(
                                            i,
                                            "item_name",
                                            product?.name || "",
                                          );
                                          handleEditItemChange(
                                            i,
                                            "unit_price",
                                            product?.mrp || 0,
                                          );
                                        }}
                                        className={inputCls}
                                      >
                                        <option value="">Select Product</option>
                                        {rowProducts.map((p: any) => (
                                          <option key={p._id} value={p._id}>
                                            {p.name}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={labelCls}>Price</label>
                                      <input
                                        type="number"
                                        value={item.unit_price}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "unit_price",
                                            e.target.value,
                                          )
                                        }
                                        readOnly={
                                          !isGeneralCategory(item.category_id)
                                        }
                                        className={`${inputCls} ${!isGeneralCategory(item.category_id) ? "bg-gray-50 text-gray-400" : ""}`}
                                      />
                                    </div>
                                    <div>
                                      <label className={labelCls}>Qty</label>
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "quantity",
                                            e.target.value,
                                          )
                                        }
                                        className={inputCls}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className={labelCls}>Discount</label>
                                    <div className="flex gap-2">
                                      <select
                                        value={item.discount_type}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "discount_type",
                                            e.target.value,
                                          )
                                        }
                                        className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none w-16 shrink-0 bg-white"
                                      >
                                        <option value="percent">%</option>
                                        <option value="amount">Amt</option>
                                      </select>
                                      <input
                                        type="number"
                                        value={item.discount_percent}
                                        onChange={(e) =>
                                          handleEditItemChange(
                                            i,
                                            "discount_percent",
                                            e.target.value,
                                          )
                                        }
                                        className={`${inputCls} min-w-0`}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                      Item Total
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                      {(item.total ?? 0).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {editItems.length === 0 && (
                            <div className="py-6 text-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
                              No items. Click "+ Add Item"
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{computedTotals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16 shrink-0 text-xs">
                        Discount
                      </span>
                      <select
                        value={editFields.discount_type}
                        disabled={isFinancialLocked}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            discount_type: e.target.value,
                          }))
                        }
                        className="border rounded-lg px-1.5 py-1 text-xs w-16 bg-white focus:outline-none"
                      >
                        <option value="amount">Amt</option>
                        <option value="percent">%</option>
                      </select>
                      <input
                        type="number"
                        value={editFields.discount}
                        disabled={isFinancialLocked}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            discount: e.target.value,
                          }))
                        }
                        className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none disabled:bg-gray-100"
                      />
                      <span className="text-red-500 text-xs shrink-0">
                        - {computedTotals.discountAmt.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16 shrink-0 text-xs">
                        Tax
                      </span>
                      <select
                        value={editFields.tax_type}
                        disabled={isFinancialLocked}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            tax_type: e.target.value,
                          }))
                        }
                        className="border rounded-lg px-1.5 py-1 text-xs w-16 bg-white focus:outline-none"
                      >
                        <option value="amount">Amt</option>
                        <option value="percent">%</option>
                      </select>
                      <input
                        type="number"
                        value={editFields.tax}
                        disabled={isFinancialLocked}
                        onChange={(e) =>
                          setEditFields((prev: any) => ({
                            ...prev,
                            tax: e.target.value,
                          }))
                        }
                        className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none"
                      />
                      <span className="text-green-600 text-xs shrink-0">
                        + {computedTotals.taxAmt.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>{computedTotals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  {(isDispatcher ||
                    isManager ||
                    user?.user_type === "accountant" ||
                    user?.user_type === "admin") && (
                    <div>
                      <label className={labelCls}>
                        Order Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editOrder?.status || ""}
                        onChange={(e) =>
                          setEditOrder((prev: any) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className={inputCls}
                      >
                        <option value={editOrder?.status}>
                          {formatStatus(editOrder?.status)}
                        </option>
                        {((isDispatcher &&
                          editOrder?.status !== "dispatched") ||
                          isManager) && (
                          <>
                            <option value="partial">Partial</option>
                            <option value="dispatched">Dispatched</option>
                          </>
                        )}
                        {user?.user_type === "accountant" && (
                          <option value="posted">Posted</option>
                        )}
                        {user?.user_type === "admin" &&
                          editOrder?.status === "dispatched" && (
                            <option value="posted">Posted</option>
                          )}
                        {user?.user_type === "admin" &&
                          editOrder?.status === "approved" && (
                            <>
                              <option value="partial">Partial</option>
                              <option value="dispatched">Dispatched</option>
                            </>
                          )}
                      </select>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
                  <button
                    onClick={closeEditModal}
                    className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={editSaving}
                    className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {editSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {editSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
          Orders
        </h1>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative hidden md:block w-52">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #"
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          {!(isDispatcher || isManager || user?.user_type === "accountant") && (
            <button
              onClick={() => router.push("/orders/add")}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Order</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Search mobile */}
      <div className="relative md:hidden mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #"
          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none"
        />
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Order #</th>
                <th className="py-3 px-4 text-left font-medium">Dealer</th>
                <th className="py-3 px-4 text-left font-medium">Created By</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
                <th className="py-3 px-4 text-left font-medium">Discount</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Due Date</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders?.map((o: any, i: number) => {
                const formattedStatus = formatStatus(o?.status);
                return (
                  <tr
                    key={o._id || i}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{o?.order_number}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {o?.dealer_id?.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {o?.created_by?.name} (
                      {o?.created_by?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </td>
                    <td className="py-3 px-4 text-gray-600">{o?.total}</td>
                    <td className="py-3 px-4 text-gray-600">{o?.discount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium ${statusStyle[formattedStatus]}`}
                      >
                        {formattedStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {o?.due_date
                        ? new Date(o.due_date).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            top: rect.bottom + 8,
                            left: getActionMenuLeft(rect.left),
                          });
                          setOpenMenu(openMenu === o._id ? null : o._id);
                        }}
                        className={actionTriggerCls}
                      >
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedOrders?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>
            Showing {paginatedOrders?.length || 0} of {filtered?.length || 0}{" "}
            orders
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1 border rounded-lg ${currentPage === page ? "bg-gray-900 text-white border-gray-900" : "border-gray-200"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-2">
        {paginatedOrders?.map((o: any, i: number) => {
          const formattedStatus = formatStatus(o?.status);
          return (
            <div
              key={o._id || i}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {o?.order_number}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {o?.dealer_id?.name || "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {o?.created_by?.name} ·{" "}
                    {o?.created_by?.user_type === "admin"
                      ? "Director"
                      : "Salesman"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusStyle[formattedStatus]}`}
                  >
                    {formattedStatus}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPosition({
                        top: rect.bottom + 8,
                        left: getActionMenuLeft(rect.left),
                      });
                      setOpenMenu(openMenu === o._id ? null : o._id);
                    }}
                    className={actionTriggerCls}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>
                    Total:{" "}
                    <span className="font-medium text-gray-800">
                      {o?.total}
                    </span>
                  </span>
                  <span>
                    Disc:{" "}
                    <span className="font-medium text-gray-800">
                      {o?.discount}
                    </span>
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {o?.due_date
                    ? new Date(o.due_date).toLocaleDateString("en-GB")
                    : "-"}
                </span>
              </div>
            </div>
          );
        })}
        {paginatedOrders?.length === 0 && (
          <div className="py-10 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No orders found
          </div>
        )}
        {/* Mobile pagination */}
        <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
          <span>
            {paginatedOrders?.length || 0} of {filtered?.length || 0}
          </span>
          {totalPages > 1 && (
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-2.5 py-1 bg-gray-900 text-white rounded-lg">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── DROPDOWN MENU ── */}
      {openMenu &&
        (() => {
          const selectedOrder = filtered?.find(
            (item: any) => item._id === openMenu,
          );
          if (!selectedOrder) return null;

          return (
            <div
              style={{
                position: "fixed",
                top: menuPosition.top,
                left: menuPosition.left,
                zIndex: 9999,
              }}
              className="dropdown-menu w-56 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  handleView(selectedOrder._id);
                  setOpenMenu(null);
                }}
                className={menuItemCls}
              >
                <Eye size={15} className={menuIconCls} />
                View
              </button>

              <button
                type="button"
                onClick={() => {
                  handleHistory(selectedOrder);
                  setOpenMenu(null);
                }}
                className={menuItemCls}
              >
                <History size={15} className={menuIconCls} />
                History
              </button>

              {canShareOrder(selectedOrder) && (
                <>
                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() => handleShareOrder(selectedOrder, "text")}
                    className={menuItemCls}
                  >
                    <Share2 size={15} className={menuIconCls} />
                    Share Text
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareOrder(selectedOrder, "prepare-pdf")}
                    className={menuItemCls}
                  >
                    <FileText size={15} className={menuIconCls} />
                    {pdfPreparingId === selectedOrder._id
                      ? "Preparing PDF..."
                      : "Prepare PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareOrder(selectedOrder, "share-ready-pdf")}
                    disabled={
                      !preparedPdfFile ||
                      String(preparedPdfOrder?._id) !== String(selectedOrder._id)
                    }
                    className={menuItemCls}
                  >
                    <Share2 size={15} className={menuIconCls} />
                    Share Ready PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareOrder(selectedOrder, "download")}
                    className={menuItemCls}
                  >
                    <Download size={15} className={menuIconCls} />
                    Download PDF
                  </button>
                </>
              )}

              {canEditOrder(selectedOrder) && (
                <>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    type="button"
                    onClick={() => {
                      handleEdit(selectedOrder._id);
                      setOpenMenu(null);
                    }}
                    className={menuItemCls}
                  >
                    <Pencil size={15} className={menuIconCls} />
                    Edit
                  </button>
                </>
              )}

              {canApproveOrder(selectedOrder) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAction(selectedOrder._id, "approve");
                    setOpenMenu(null);
                  }}
                  className={menuSuccessCls}
                >
                  <Check size={15} className={menuSuccessIconCls} />
                  Approve
                </button>
              )}

              {canUnapproveOrder(selectedOrder) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAction(selectedOrder._id, "unapprove");
                    setOpenMenu(null);
                  }}
                  className={menuWarningCls}
                >
                  <X size={15} className={menuWarningIconCls} />
                  Unapprove
                </button>
              )}

              {canRejectOrder(selectedOrder) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAction(selectedOrder._id, "reject");
                    setOpenMenu(null);
                  }}
                  className={menuDangerCls}
                >
                  <X size={15} className={menuDangerIconCls} />
                  Reject
                </button>
              )}

              {canDeleteOrder(selectedOrder) && (
                <button
                  type="button"
                  onClick={() => {
                    handleAction(selectedOrder._id, "delete");
                    setOpenMenu(null);
                  }}
                  className={menuDangerCls}
                >
                  <Trash2 size={15} className={menuDangerIconCls} />
                  Delete
                </button>
              )}
            </div>
          );
        })()}
    </div>
  );
}

export default OrdersPage;
