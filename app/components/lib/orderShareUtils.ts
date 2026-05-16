import { order } from "@/app/components/services/orderService";

const formatDate = (date: any) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-GB");
};

const getProductCode = (item: any) => {
  const name =
    item?.item_name ||
    item?.product_name ||
    item?.product_id?.name ||
    item?.product_id?.product_name ||
    item?.product?.name ||
    item?.name ||
    "Item";

  const match = String(name).match(/\(([^)]+)\)/);

  return match ? match[1].trim() : String(name).trim();
};

export const formatOrderShareText = (orderData: any, items: any[] = []) => {
  const dealer = orderData?.dealer_id;
  const createdBy = orderData?.created_by;

  const itemsText =
    items.length > 0
      ? items
          .map((item) => {
            const productCode = getProductCode(item);
            return `${productCode}       Qty: ${item?.quantity || 0}`;
          })
          .join("\n")
      : "No items found";

  return `Order #: ${orderData?.order_number || "-"}
Due Date: ${formatDate(orderData?.due_date)}

Dealer: ${dealer?.name || "-"}
Phone: ${dealer?.phone_number || dealer?.whatsapp_number || ""}

Created By: ${createdBy?.name || "-"}

-------------------------
${itemsText}
-------------------------

Status: ${orderData?.status || "-"}`;
};

/* =========================
   TEXT SHARE
   Important: call this directly from button click
========================= */
export const shareOrderText = async (orderData: any, items: any[] = []) => {
  const text = formatOrderShareText(orderData, items);

  try {
    if (navigator.share) {
      await navigator.share({
        title: `Order ${orderData?.order_number || ""}`,
        text,
      });

      return { success: true };
    }

    await navigator.clipboard.writeText(text);

    return {
      success: true,
      message: "Order text copied",
    };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return {
        success: false,
        cancelled: true,
        message: "Share cancelled",
      };
    }

    return {
      success: false,
      message: error?.message || "Share failed",
    };
  }
};

/* =========================
   PREPARE PDF FILE
   This can take time, so run it before share button
========================= */
export const prepareOrderPdfFile = async (orderData: any) => {
  const blob = await order.downloadPDF(orderData?._id);

  return new File(
    [blob],
    `order-${orderData?.order_number || orderData?._id}.pdf`,
    {
      type: "application/pdf",
    }
  );
};

/* =========================
   SHARE READY PDF
   Important: no fetch / await before navigator.share
========================= */
export const sharePreparedPdfFile = async (
  orderData: any,
  pdfFile: File
) => {
  try {
    if (!navigator.share) {
      return {
        success: false,
        message: "Share option is not supported on this browser",
      };
    }

    if (navigator.canShare && !navigator.canShare({ files: [pdfFile] })) {
      return {
        success: false,
        message: "PDF file sharing is not supported on this device",
      };
    }

    await navigator.share({
      title: `Order ${orderData?.order_number || ""}`,
      text: `Please find attached order ${orderData?.order_number || ""}.`,
      files: [pdfFile],
    });

    return { success: true };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return {
        success: false,
        cancelled: true,
        message: "Share cancelled",
      };
    }

    return {
      success: false,
      message: error?.message || "PDF share failed",
    };
  }
};

/* =========================
   DOWNLOAD PDF
========================= */
export const downloadOrderPdf = async (orderData: any) => {
  try {
    const blob = await order.downloadPDF(orderData?._id);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `order-${orderData?.order_number || orderData?._id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "PDF download failed",
    };
  }
};