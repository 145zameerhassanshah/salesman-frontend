// QuotationsPage — full updated component
"use client";
import QuotationService from "@/app/components/services/quotationService";
import AuditLogService from "@/app/components/services/AuditLogService";

import { useCategory } from "@/hooks/useCategory";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Trash2,
  MoreVertical,
  Download,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDealers } from "@/hooks/useDealers";

const statusStyle: any = {
  Pending: "bg-yellow-100 text-yellow-600",
  Active: "bg-blue-100 text-blue-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-orange-100 text-orange-600",
};

export default function QuotationsPage() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
const QUOTATIONS_PER_PAGE = 10;

const [quotations, setQuotations] = useState<any[]>([]);
const [listLoading, setListLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState<any>(null);
const [debouncedSearch, setDebouncedSearch] = useState("");
const requestIdRef = useRef(0);
  const { data: categories = [] } = useCategory(user?.industry);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [productMap, setProductMap] = useState<any>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const [viewQuotation, setViewQuotation] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  const [editQuotation, setEditQuotation] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editFetchLoading, setEditFetchLoading] = useState(false);

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

  const { data: dealer } = useDealers(user?.industry);
  const dealers = dealer?.dealers;

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

useEffect(() => {
  const loadProducts = async () => {
    const categoryIds = Array.from(
      new Set(
        editItems
          .map((item) => item.category_id)
          .filter((id) => id && !productMap[id])
      )
    );

    if (categoryIds.length === 0) return;

    const results = await Promise.all(
      categoryIds.map(async (categoryId: any) => {
        const res = await QuotationService.getProductsByCategory(categoryId);
        return {
          categoryId,
          products: res.products || res || [],
        };
      })
    );

    setProductMap((prev: any) => {
      const updated = { ...prev };

      results.forEach((item) => {
        updated[item.categoryId] = item.products;
      });

      return updated;
    });
  };

  if (editItems.length > 0) loadProducts();
}, [editItems]);
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
    setCurrentPage(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

const handleStatusFilterChange = (value: string) => {
  setStatusFilter(value);
  setCurrentPage(1);
};
const loadQuotations = async (page = currentPage) => {
  if (!user?.industry) return;

  const requestId = ++requestIdRef.current;

  setListLoading(true);

  try {
    const res = await QuotationService.getQuotationsPaginated(user.industry, {
      page,
      limit: QUOTATIONS_PER_PAGE,
      search: debouncedSearch,
      status: statusFilter,
    });

    if (requestId !== requestIdRef.current) return;

    if (res?.success) {
      setQuotations(res.quotations || []);
      setPagination(
        res.pagination || {
          page,
          limit: QUOTATIONS_PER_PAGE,
          total: 0,
          totalPages: 1,
        }
      );
    } else {
      setQuotations([]);
      setPagination({
        page: 1,
        limit: QUOTATIONS_PER_PAGE,
        total: 0,
        totalPages: 1,
      });
    }
  } catch {
    if (requestId !== requestIdRef.current) return;

    setQuotations([]);
    setPagination({
      page: 1,
      limit: QUOTATIONS_PER_PAGE,
      total: 0,
      totalPages: 1,
    });

    toast.error("Failed to load quotations");
  } finally {
    if (requestId === requestIdRef.current) {
      setListLoading(false);
    }
  }
};
useEffect(() => {
  loadQuotations(currentPage);
}, [user?.industry, currentPage, debouncedSearch, statusFilter]);

const filtered = quotations;

const totalPages = pagination?.totalPages || 1;
const totalRecords = pagination?.total || 0;
const startRecord =
  totalRecords === 0 ? 0 : (currentPage - 1) * QUOTATIONS_PER_PAGE + 1;

const endRecord = Math.min(currentPage * QUOTATIONS_PER_PAGE, totalRecords);
const pageNumbers = useMemo(() => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}, [currentPage, totalPages]);

const goToPage = (page: number) => {
  if (listLoading) return;
  if (page < 1 || page > totalPages) return;
  if (page === currentPage) return;

  setOpenMenu(null);
  setCurrentPage(page);
};
  const formatStatus = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";

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
      quotation_number: "Quotation Number",
      payment_term: "Payment Term",
      valid_until: "Valid Until",
      deliveryNotes: "Delivery Notes",
      status: "Status",
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
      if (value?.quotation_number) return value.quotation_number;
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
        String(oldItem.discount_type || "percentage") !==
        String(newItem.discount_type || "percentage")
      ) {
        changes.push({
          type: "UPDATED",
          text: `${getItemName(newItem)} discount type changed ${oldItem.discount_type || "percentage"} → ${newItem.discount_type || "percentage"}`,
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

  const formatAmount = (v: any) => Number(v || 0).toFixed(0);

const handleView = async (id: string) => {
  setViewLoading(true);
  setAuditLoading(true);
  setAuditLogs([]);

  try {
    const [res, logsRes] = await Promise.all([
      QuotationService.getQuotationById(id),
      AuditLogService.getEntityAuditLogs("QUOTATION", id),
    ]);

    if (!res.success) {
      return toast.error(res?.message || "Failed to load quotation");
    }

    setViewQuotation(res?.quotation);
    setViewItems(res?.items || []);

    if (logsRes?.success) {
      setAuditLogs(logsRes?.data || []);
    } else {
      setAuditLogs([]);
    }
  } catch {
    toast.error("Failed to load quotation details");
  } finally {
    setViewLoading(false);
    setAuditLoading(false);
  }

  setOpenMenu(null);
};
  const openEdit = async (quotation: any) => {
    setEditFetchLoading(true);
    setEditQuotation({ _placeholder: true });
    const discountType = quotation?.discount_type || "fixed";
    const taxType = quotation?.tax_type || "fixed";
    const rawDiscount =
      discountType === "percentage" && quotation?.subtotal > 0
        ? ((quotation.discount / quotation.subtotal) * 100).toFixed(2)
        : quotation?.discount || 0;
    const rawTax =
      taxType === "percentage" && quotation?.subtotal - quotation?.discount > 0
        ? (
            (quotation.tax / (quotation.subtotal - quotation.discount)) *
            100
          ).toFixed(2)
        : quotation?.tax || 0;
    setEditForm({
      valid_until: quotation?.valid_until?.split("T")[0] || "",
      discount: rawDiscount,
      discount_type: discountType,
      tax: rawTax,
      tax_type: taxType,
      deliveryNotes: quotation?.deliveryNotes || "",
      dealer_id: quotation?.dealer_id?._id || quotation?.dealer_id || "",
    });
    try {
      const res = await QuotationService.getQuotationById(quotation._id);
      if (res.success) {
        setEditQuotation(res.quotation);
        setEditItems(
          res.items.map((item: any) => ({
            ...item,
            product_id: item.product_id || "",
            category_id: item.category_id || "",
            discount_type: item.discount_type || "percentage",
          })),
        );
      }
    } catch {
      toast.error("Failed to load quotation items");
      setEditQuotation(null);
    } finally {
      setEditFetchLoading(false);
    }
    setOpenMenu(null);
  };

  const closeEdit = () => {
    setEditQuotation(null);
    setEditForm({});
    setEditItems([]);
  };

  const updateEditItem = (index: number, key: string, value: any) => {
    const updated = [...editItems];

    if (["unit_price", "quantity", "discount_percent"].includes(key)) {
      updated[index][key] = Number(value) || 0;
    } else {
      updated[index][key] = value;
    }

    const gross =
      Number(updated[index].unit_price || 0) *
      Number(updated[index].quantity || 0);
    const discountValue = Number(updated[index].discount_percent || 0);
    const discountType = updated[index].discount_type || "percentage";

    const discountAmount =
      discountType === "fixed" ? discountValue : (gross * discountValue) / 100;

    updated[index].total = Number((gross - discountAmount).toFixed(2));

    setEditItems(updated);
  };
  const addEditItem = () =>
    setEditItems([
      ...editItems,
      {
        product_id: "",
        category_id: "",
        item_name: "",
        unit_price: 0,
        discount_percent: 0,
        discount_type: "percentage",
        quantity: 1,
        total: 0,
      },
    ]);
  const removeEditItem = (i: number) =>
    setEditItems(editItems.filter((_, idx) => idx !== i));

  const computedTotals = useMemo(() => {
    const subtotal = editItems.reduce((s, i) => s + Number(i.total || 0), 0);
    const discountAmt =
      editForm.discount_type === "percentage"
        ? (subtotal * Number(editForm.discount || 0)) / 100
        : Number(editForm.discount || 0);
    const taxAmt =
      editForm.tax_type === "percentage"
        ? ((subtotal - discountAmt) * Number(editForm.tax || 0)) / 100
        : Number(editForm.tax || 0);
    return {
      subtotal,
      discountAmt,
      taxAmt,
      total: subtotal - discountAmt + taxAmt,
    };
  }, [editItems, editForm]);

  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      const payload = {
        valid_until: editForm.valid_until,
        deliveryNotes: editForm.deliveryNotes,
        discount: editForm.discount,
        discount_type: editForm.discount_type,
        tax: editForm.tax,
        tax_type: editForm.tax_type,
        dealer_id: editForm.dealer_id,
        subtotal: computedTotals.subtotal,
        total: computedTotals.total,
        items: editItems.map((item) => ({
          product_id: item.product_id || null,
          category_id: item.category_id || null,
          item_name: item.item_name,
          unit_price: Number(item.unit_price),
          discount_percent: Number(item.discount_percent),
          discount_type: item.discount_type || "percentage",
          quantity: Number(item.quantity),
          total: Number(item.total),
        })),
      };
      const res = await QuotationService.updateQuotation(
        payload,
        editQuotation._id,
      );
      if (!res.success) return toast.error(res?.message || "Update failed");
      toast.success("Quotation updated successfully");
await loadQuotations(currentPage);
      closeEdit();
    } catch {
      toast.error("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

const handleDownloadPDF = async (id: string) => {
  try {
    const res = await QuotationService.downloadPdf(id);

    if (!res?.success) {
      return toast.error(res?.message || "Failed to download PDF");
    }

    toast.success("Downloading PDF...");
  } catch {
    toast.error("Failed to download PDF");
  }

  setOpenMenu(null);
};
  const handleConfirm = async () => {
    if (!confirmId || !confirmAction) return;
    try {
      if (confirmAction === "approve")
        await QuotationService.updateQuotationStatus(confirmId, "approved");
      else if (confirmAction === "reject")
        await QuotationService.updateQuotationStatus(confirmId, "rejected");
      else if (confirmAction === "delete")
        await QuotationService.deleteQuotation(confirmId);
      toast.success(
        confirmAction === "delete"
          ? "Quotation deleted"
          : `Quotation ${confirmAction}d`,
      );
await loadQuotations(currentPage);
    } catch {
      toast.error("Action failed");
    } finally {
      setConfirmId(null);
      setConfirmAction(null);
    }
  };

  const getCurrentUserId = () => {
    return user?._id || user?.id;
  };

  const getCreatedById = (q: any) => {
    return q?.created_by?._id || q?.created_by;
  };

  const isOwnQuotation = (q: any) => {
    return String(getCreatedById(q)) === String(getCurrentUserId());
  };

  const canEdit = (q: any) => {
    const s = q?.status?.toLowerCase();

    if (user?.user_type === "admin") {
      return ["pending", "approved", "rejected"].includes(s);
    }

    if (user?.user_type === "salesman" && isOwnQuotation(q)) {
      return ["pending", "rejected"].includes(s);
    }

    return false;
  };

  const canDelete = (q: any) => {
    const s = q?.status?.toLowerCase();

    if (user?.user_type === "admin") {
      return ["pending", "rejected", "approved"].includes(s);
    }

    if (user?.user_type === "salesman" && isOwnQuotation(q)) {
      return ["pending", "rejected"].includes(s);
    }

    return false;
  };
  const canDownloadPDF = (q: any) =>
    user?.user_type === "admin" ||
    (user?.user_type === "salesman" && q?.status === "approved");
  const isGeneralCategory = (categoryId: any) => {
    const cat = categories.find((c: any) => c._id === categoryId);
    return cat?.name === "General Appliances";
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white";

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">
      {/* ── CONFIRM MODAL ── */}
      {confirmId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              {confirmAction === "approve"
                ? "Approve Quotation?"
                : confirmAction === "reject"
                  ? "Reject Quotation?"
                  : "Delete Quotation?"}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {confirmAction === "approve"
                ? "Are you sure you want to approve this quotation?"
                : confirmAction === "reject"
                  ? "Reject this quotation? This cannot be undone."
                  : "Delete this quotation? This cannot be undone."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmId(null);
                  setConfirmAction(null);
                }}
                className="px-3 py-1.5 rounded-lg border text-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-3 py-1.5 rounded-lg text-white text-sm ${confirmAction === "approve" ? "bg-green-600" : "bg-red-600"}`}
              >
                {confirmAction === "approve"
                  ? "Approve"
                  : confirmAction === "reject"
                    ? "Reject"
                    : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {(viewQuotation || viewLoading) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
            {viewLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Loading...
              </div>
            ) : viewQuotation ? (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {viewQuotation?.quotation_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(viewQuotation?.status)] || ""}`}
                    >
                      {formatStatus(viewQuotation?.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setViewQuotation(null);
                      setViewItems([]);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Dealer</p>
                      <p className="text-sm font-medium">
                        {viewQuotation?.dealer_id?.name || "-"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 mb-0.5">
                        Created By
                      </p>
                      <p className="text-sm">
                        {viewQuotation?.created_by?.name || "-"} (
                        {viewQuotation?.created_by?.user_type === "admin"
                          ? "Director"
                          : "Salesman"}
                        )
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Status</p>
                      <p className="text-sm font-medium">
                        {formatStatus(viewQuotation?.status)}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 mb-0.5">
                        Valid Until
                      </p>
                      <p className="text-sm font-medium">
                        {viewQuotation?.valid_until
                          ? new Date(
                              viewQuotation.valid_until,
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {viewQuotation?.deliveryNotes && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                      <p className="text-xs text-yellow-600 font-medium mb-1">
                        Delivery Notes
                      </p>
                      <p className="text-sm text-gray-700">
                        {viewQuotation.deliveryNotes}
                      </p>
                    </div>
                  )}

                  {/* Items — scrollable table on mobile */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Items
                    </p>
                    <div className="border border-gray-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-sm min-w-[420px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs">
                          <tr>
                            <th className="text-left px-3 py-2">Product</th>
                            <th className="px-3 py-2 text-center">Qty</th>
                            <th className="px-3 py-2 text-center">Price</th>
                            <th className="px-2 py-2 text-center">Discount</th>
                            <th className="px-3 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewItems?.length > 0 ? (
                            viewItems.map((item: any, i: number) => (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="px-3 py-2">
                                  {item?.item_name ||
                                    item?.product_id?.name ||
                                    "-"}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.quantity || 0}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.unit_price || 0}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item?.discount_type === "fixed"
                                    ? `${item?.discount_percent || 0} Amt`
                                    : `${item?.discount_percent || 0}%`}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  {Number(item?.total || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-3 py-6 text-center text-gray-400"
                              >
                                No items found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{viewQuotation?.subtotal || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Discount</span>
                      <span>- {viewQuotation?.discount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>+ {viewQuotation?.tax || 0}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>{viewQuotation?.total || 0}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Activity Timeline
                    </p>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 max-h-44 overflow-y-auto">
                      {auditLoading ? (
                        <p className="text-xs text-gray-400">Loading logs...</p>
                      ) : auditLogs.length === 0 ? (
                        <p className="text-xs text-gray-400">
                          No activity found
                        </p>
                      ) : (
                        auditLogs.map((log: any, i: number) => (
                          <div
                            key={log?._id || i}
                            className="text-xs border-b pb-2 last:border-none"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-gray-700">
                                {String(log.action || "").replaceAll("_", " ")}
                              </p>

                              <p className="text-gray-400">
                                {log.createdAt
                                  ? new Date(log.createdAt).toLocaleString()
                                  : "-"}
                              </p>
                            </div>

                            <p className="text-gray-500 mt-0.5">
                              {log.description || "Action performed"}
                            </p>

                            <p className="text-gray-400 mt-0.5">
                              by {getPerformedByText(log)}
                            </p>

                            {log.changes &&
                              Object.keys(log.changes).length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {Object.entries(log.changes)
                                    .filter(
                                      ([field]) =>
                                        !hiddenAuditFields.includes(field),
                                    )
                                    .slice(0, 5)
                                    .map(([field, value]: any) => (
                                      <p key={field} className="text-gray-500">
                                        <span className="font-medium">
                                          {formatAuditField(field)}
                                        </span>
                                        :{" "}
                                        <span>
                                          {formatAuditValue(value?.from)}
                                        </span>
                                        {" → "}
                                        <span>
                                          {formatAuditValue(value?.to)}
                                        </span>
                                      </p>
                                    ))}
                                </div>
                              )}

                            {log?.meta?.oldItems && log?.meta?.newItems && (
                              <div className="mt-1 space-y-1">
                                {getItemChanges(
                                  log.meta.oldItems,
                                  log.meta.newItems,
                                )
                                  .slice(0, 6)
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

                            {log?.meta?.items &&
                              log?.meta?.items?.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {log.meta.items
                                    .slice(0, 6)
                                    .map((item: any, index: number) => (
                                      <p key={index} className="text-gray-500">
                                        <span className="font-medium">
                                          ADDED
                                        </span>
                                        : {getItemName(item)} added
                                      </p>
                                    ))}
                                </div>
                              )}

                            {log?.meta?.deletedItems &&
                              log?.meta?.deletedItems?.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {log.meta.deletedItems
                                    .slice(0, 6)
                                    .map((item: any, index: number) => (
                                      <p key={index} className="text-gray-500">
                                        <span className="font-medium">
                                          REMOVED
                                        </span>
                                        : {getItemName(item)} removed
                                      </p>
                                    ))}
                                </div>
                              )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editQuotation && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col">
            {editFetchLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading
                quotation...
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      Edit — {editQuotation?.quotation_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle[formatStatus(editQuotation?.status)] || ""}`}
                    >
                      {formatStatus(editQuotation?.status)}
                    </span>
                  </div>
                  <button
                    onClick={closeEdit}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                  {/* Info row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Dealer</p>
                      <select
                        value={editForm.dealer_id || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            dealer_id: e.target.value,
                          })
                        }
                        className={inputCls}
                      >
                        <option value="">Select Dealer</option>
                        {dealers?.map((d: any) => (
                          <option key={d._id} value={d._id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-2 mb-0.5">
                        Created By
                      </p>
                      <p className="text-sm">
                        {editQuotation?.created_by?.name || "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">Valid Until</p>
                      <input
                        type="date"
                        value={editForm.valid_until || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            valid_until: e.target.value,
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Delivery Notes
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.deliveryNotes || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          deliveryNotes: e.target.value,
                        })
                      }
                      placeholder="Add delivery notes..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Items
                      </p>
                      <button
                        onClick={addEditItem}
                        className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg"
                      >
                        + Add Item
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-sm min-w-[560px]">
                        <thead className="bg-gray-50 text-gray-500 text-xs">
                          <tr>
                            <th className="px-2 py-2 text-left">Category</th>
                            <th className="px-2 py-2 text-left">Product</th>
                            <th className="px-2 py-2 text-center">Qty</th>
                            <th className="px-2 py-2 text-center">Price</th>
                            <th className="px-2 py-2 text-center">Discount</th>
                            <th className="px-2 py-2 text-right">Total</th>
                            <th className="px-2 py-2 text-center">Del</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editItems.map((item, index) => {
                            const rowProducts =
                              productMap[item.category_id] || [];
                            return (
                              <tr
                                key={index}
                                className="border-t border-gray-100"
                              >
                                <td className="px-1.5 py-1.5">
                                  <select
                                    value={item.category_id || ""}
                                    onChange={async (e) => {
                                      const categoryId = e.target.value;
                                      updateEditItem(
                                        index,
                                        "category_id",
                                        categoryId,
                                      );
                                      updateEditItem(index, "product_id", "");
                                      updateEditItem(index, "item_name", "");
                                      if (!productMap[categoryId]) {
                                        const res =
                                          await QuotationService.getProductsByCategory(
                                            categoryId,
                                          );
                                        setProductMap((prev: any) => ({
                                          ...prev,
                                          [categoryId]:
                                            res.products || res || [],
                                        }));
                                      }
                                    }}
                                    className={inputCls}
                                  >
                                    <option value="">Category</option>
                                    {categories
                                      ?.filter((c: any) => c.is_active)
                                      .map((cat: any) => (
                                        <option key={cat._id} value={cat._id}>
                                          {cat.name}
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
                                        updateEditItem(
                                          index,
                                          "item_name",
                                          e.target.value,
                                        );
                                        updateEditItem(index, "product_id", "");
                                      }}
                                      className={inputCls}
                                    />
                                  ) : (
                                    <select
                                      value={item.product_id || ""}
                                      onChange={(e) => {
                                        const productId = e.target.value;
                                        const selected = rowProducts.find(
                                          (p: any) => p._id === productId,
                                        );

                                        updateEditItem(
                                          index,
                                          "product_id",
                                          productId,
                                        );
                                        updateEditItem(
                                          index,
                                          "item_name",
                                          selected?.name || "",
                                        );
                                        updateEditItem(
                                          index,
                                          "unit_price",
                                          selected?.mrp || 0,
                                        );
                                        updateEditItem(
                                          index,
                                          "discount_percent",
                                          0,
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
                                    value={item.quantity || 1}
                                    onChange={(e) =>
                                      updateEditItem(
                                        index,
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
                                    value={item.unit_price || 0}
                                    onChange={(e) =>
                                      updateEditItem(
                                        index,
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
                                      value={item.discount_type || "percentage"}
                                      onChange={(e) =>
                                        updateEditItem(
                                          index,
                                          "discount_type",
                                          e.target.value,
                                        )
                                      }
                                      className="border border-gray-200 rounded-lg px-1 py-1.5 text-xs w-16 bg-white focus:outline-none"
                                    >
                                      <option value="percentage">%</option>
                                      <option value="fixed">Amt</option>
                                    </select>

                                    <input
                                      type="number"
                                      value={item.discount_percent || 0}
                                      onChange={(e) =>
                                        updateEditItem(
                                          index,
                                          "discount_percent",
                                          e.target.value,
                                        )
                                      }
                                      className={`${inputCls} text-center min-w-0`}
                                    />
                                  </div>
                                </td>
                                <td className="px-1.5 py-1.5 text-right font-medium text-xs whitespace-nowrap">
                                  {(item.total ?? 0).toFixed(2)}
                                </td>
                                <td className="px-1.5 py-1.5 text-center">
                                  <button
                                    onClick={() => removeEditItem(index)}
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
                        value={editForm.discount_type || "fixed"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            discount_type: e.target.value,
                          })
                        }
                        className="border rounded-lg px-2 py-1 text-xs w-16 bg-white focus:outline-none"
                      >
                        <option value="fixed">Amt</option>
                        <option value="percentage">%</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.discount || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, discount: e.target.value })
                        }
                        className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none"
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
                        value={editForm.tax_type || "fixed"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tax_type: e.target.value })
                        }
                        className="border rounded-lg px-2 py-1 text-xs w-16 bg-white focus:outline-none"
                      >
                        <option value="fixed">Amt</option>
                        <option value="percentage">%</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.tax || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tax: e.target.value })
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
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
                  <button
                    onClick={closeEdit}
                    className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={editLoading}
                    className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {editLoading ? "Saving..." : "Save Changes"}
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
          Quotations
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
              placeholder="Search quotation #"
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => router.push("/quotations/add")}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Quotation</span>
            <span className="sm:hidden">Add</span>
          </button>
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
          placeholder="Search quotation #"
          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none"
        />
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Quotation #</th>
                <th className="py-3 px-4 text-left font-medium">Dealer</th>
                <th className="py-3 px-4 text-left font-medium">Salesman</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
                <th className="py-3 px-4 text-left font-medium">Discount</th>
                <th className="py-3 px-4 text-left font-medium">
                  <select
                    value={statusFilter}
onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="text-gray-500 font-semibold bg-transparent focus:outline-none cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </th>
                <th className="py-3 px-4 text-left font-medium">Due Date</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
<tbody>
{listLoading && quotations.length === 0 ? (
  <tr>
    <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
      Loading quotations...
    </td>
  </tr>
) : filtered?.map((quotation: any) => (
                      <tr
                  key={quotation._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">
                    {quotation.quotation_number}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {quotation.dealer_id?.name || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {quotation.created_by?.name} (
                    {quotation.created_by?.user_type === "admin"
                      ? "Director"
                      : "Salesman"}
                    )
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatAmount(quotation.total)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatAmount(quotation.discount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium ${statusStyle[formatStatus(quotation.status)] || ""}`}
                    >
                      {formatStatus(quotation.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {quotation.valid_until
                      ? new Date(quotation.valid_until).toLocaleDateString(
                          "en-GB",
                        )
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openMenu === quotation._id) {
                            setOpenMenu(null);
                            return;
                          }
                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          setMenuPosition({
                            top: rect.bottom + window.scrollY + 4,
                            right: window.innerWidth - rect.right,
                          });
                          setOpenMenu(quotation._id);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
{!listLoading && filtered?.length === 0 && (
                  <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
<div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
  <span>
Showing{" "}
<span className="font-medium text-gray-700">{startRecord}</span>
{" - "}
<span className="font-medium text-gray-700">{endRecord}</span>
{" of "}
<span className="font-medium text-gray-700">{totalRecords}</span>{" "}
quotations
  </span>

  {totalPages > 1 && (
    <div className="flex items-center gap-1">
      <button
onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || listLoading}
        className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
onClick={() => goToPage(page)}
          disabled={listLoading}
          className={`px-2.5 py-1 border rounded-lg ${
            currentPage === page
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || listLoading}
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
{listLoading && quotations.length === 0 ? (
  <div className="py-10 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
    Loading quotations...
  </div>
) : filtered?.map((quotation: any) => (
              <div
            key={quotation._id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {quotation.quotation_number}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {quotation.dealer_id?.name || "—"}
                </p>
                <p className="text-xs text-gray-400">
                  {quotation.created_by?.name} ·{" "}
                  {quotation.created_by?.user_type === "admin"
                    ? "Director"
                    : "Salesman"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusStyle[formatStatus(quotation.status)] || ""}`}
                >
                  {formatStatus(quotation.status)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openMenu === quotation._id) {
                      setOpenMenu(null);
                      return;
                    }
                    const rect = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    setMenuPosition({
                      top: rect.bottom + window.scrollY + 4,
                      right: window.innerWidth - rect.right,
                    });
                    setOpenMenu(quotation._id);
                  }}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
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
                    {formatAmount(quotation.total)}
                  </span>
                </span>
                <span>
                  Disc:{" "}
                  <span className="font-medium text-gray-800">
                    {formatAmount(quotation.discount)}
                  </span>
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {quotation.valid_until
                  ? new Date(quotation.valid_until).toLocaleDateString("en-GB")
                  : "-"}
              </span>
            </div>
          </div>
        ))}
{!listLoading && filtered?.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No quotations found
          </div>
        )}
<div className="flex items-center justify-between pt-1 text-xs text-gray-400">
<span>
{startRecord} - {endRecord} of {totalRecords}
  {listLoading && quotations.length > 0 && (
    <span className="ml-2 text-gray-400">Updating...</span>
  )}
</span>
  {totalPages > 1 && (
    <div className="flex gap-1">
      <button
onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || listLoading}
        className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      <span className="px-2.5 py-1 bg-gray-900 text-white rounded-lg">
        {currentPage}/{totalPages}
      </span>

<button
  onClick={() => goToPage(currentPage + 1)}
  disabled={currentPage === totalPages || listLoading}
  className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
>
  Next
</button>
    </div>
  )}
</div>
      </div>

      {/* ── DROPDOWN MENU ── */}
      {openMenu && (
        <div
          style={{
            position: "fixed",
            top: menuPosition.top,
            right: menuPosition.right,
            zIndex: 9999,
          }}
          className="w-40 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const q = filtered?.find((q: any) => q._id === openMenu);
            if (!q) return null;
            return (
              <>
                <button
                  onClick={() => {
                    handleView(q._id);
                    setOpenMenu(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  View
                </button>
                {canDownloadPDF(q) && (
                  <button
                    onClick={() => {
                      handleDownloadPDF(q._id);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Download PDF
                  </button>
                )}
                {canEdit(q) && (
                  <button
                    onClick={() => {
                      openEdit(q);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                  >
                    Edit
                  </button>
                )}
                {user?.user_type === "admin" &&
                  (q.status === "pending" || q.status === "rejected") && (
                    <button
                      onClick={() => {
                        setConfirmId(q._id);
                        setConfirmAction("approve");
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-50 text-sm"
                    >
                      Approve
                    </button>
                  )}
                {user?.user_type === "admin" &&
                  (q.status === "pending" || q.status === "approved") && (
                    <button
                      onClick={() => {
                        setConfirmId(q._id);
                        setConfirmAction("reject");
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm"
                    >
                      Reject
                    </button>
                  )}
                {canDelete(q) && (
                  <button
                    onClick={() => {
                      setConfirmId(q._id);
                      setConfirmAction("delete");
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
