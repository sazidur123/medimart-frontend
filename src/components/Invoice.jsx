
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import logo from '../assets/medimart-logo.png';
import { auth } from "../firebase";

// Clean, robust, and maintainable Invoice component
function Invoice() {
  const { paymentId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch invoice data
  useEffect(() => {
    async function fetchInvoice() {
      setLoading(true);
      try {
        let token = localStorage.getItem("access_token");
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/invoice/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch invoice");
        const data = await res.json();
        setInvoice(data);
      } catch (err) {
        setInvoice(null);
      }
      setLoading(false);
    }
    if (paymentId) fetchInvoice();
  }, [paymentId]);


  // PDF styles for react-pdf
  const pdfStyles = StyleSheet.create({
    page: { backgroundColor: '#f8fafc', color: '#222', padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
    container: { maxWidth: 700, margin: '0 auto', backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,34,34,0.10)', padding: 24 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    logo: { width: 36, height: 36, marginRight: 12 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2563eb', letterSpacing: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    infoBlock: { fontSize: 13, color: '#666' },
    billedTo: { marginBottom: 14 },
    billedToLabel: { fontWeight: 600 },
    table: { width: '100%', marginBottom: 14 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: '#f1f5f9' },
    th: { flex: 1, fontWeight: 700, padding: 7, backgroundColor: '#f1f5f9', color: '#222' },
    td: { flex: 1, padding: 7, color: '#222', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 },
    totalLabel: { fontWeight: 'bold', fontSize: 16 },
    totalValue: { fontWeight: 'bold', fontSize: 16 },
    statusPaid: { color: '#22c55e', fontWeight: 700 },
  });

  // PDF Document component
  const InvoicePDF = ({ invoice }) => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.container}>
          {/* Header */}
          <View style={pdfStyles.header}>
            <Image src={logo} style={pdfStyles.logo} />
            <Text style={pdfStyles.title}>MediMart</Text>
          </View>
          {/* Invoice meta */}
          <View style={pdfStyles.infoRow}>
            <View>
              <Text style={{ fontWeight: 700, fontSize: 15 }}>Invoice</Text>
              <Text style={pdfStyles.infoBlock}>Invoice #: {invoice.invoiceNumber || invoice._id}</Text>
              <Text style={pdfStyles.infoBlock}>Date: {invoice.date ? new Date(invoice.date).toLocaleString() : ''}</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={{ fontWeight: 700 }}>Status:</Text>
              <Text style={pdfStyles.statusPaid}>{invoice.status || 'Paid'}</Text>
            </View>
          </View>
          {/* Billed to */}
          <View style={pdfStyles.billedTo}>
            <Text style={pdfStyles.billedToLabel}>Billed To:</Text>
            <Text>{invoice.user?.username || invoice.user?.email || 'User'}</Text>
            <Text style={pdfStyles.infoBlock}>{invoice.user?.email}</Text>
          </View>
          {/* Items table */}
          <View style={pdfStyles.table}>
            <View style={pdfStyles.tableHeader}>
              <Text style={pdfStyles.th}>Product</Text>
              <Text style={pdfStyles.th}>Qty</Text>
              <Text style={pdfStyles.th}>Price</Text>
              <Text style={pdfStyles.th}>Subtotal</Text>
            </View>
            {invoice.items?.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row' }}>
                <Text style={pdfStyles.td}>{item.product?.name || item.name || 'Product'}</Text>
                <Text style={pdfStyles.td}>{item.quantity}</Text>
                <Text style={pdfStyles.td}>${item.price?.toFixed(2) || '0.00'}</Text>
                <Text style={pdfStyles.td}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          {/* Grand total */}
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>Grand Total: </Text>
            <Text style={pdfStyles.totalValue}>${invoice.total ? (invoice.total / 100).toFixed(2) : "0.00"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );


  // Web UI rendering for Invoice
  if (loading) return <div className="p-8 text-center">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 mt-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full shadow" />
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">MediMart</h1>
        </div>
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${invoice.invoiceNumber || invoice._id}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              <button className="bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow-sm cursor-not-allowed" disabled>
                Preparing PDF...
              </button>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                Download PDF
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <div className="font-semibold text-lg">Invoice #: <span className="font-normal">{invoice.invoiceNumber || invoice._id}</span></div>
            <div className="text-gray-500">Date: {invoice.date ? new Date(invoice.date).toLocaleString() : ''}</div>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <div className="font-semibold text-lg">Status:</div>
            <div className="text-green-600 font-bold">{invoice.status || 'Paid'}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <div className="font-semibold">Billed To:</div>
          <div className="text-gray-800">{invoice.user?.username || invoice.user?.email || 'User'}</div>
          <div className="text-gray-500">{invoice.user?.email}</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b font-bold text-gray-700">Product</th>
              <th className="py-3 px-4 border-b font-bold text-gray-700">Qty</th>
              <th className="py-3 px-4 border-b font-bold text-gray-700">Price</th>
              <th className="py-3 px-4 border-b font-bold text-gray-700">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{item.product?.name || item.name || 'Product'}</td>
                <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-right">${item.price?.toFixed(2) || '0.00'}</td>
                <td className="py-2 px-4 border-b text-right">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <div className="font-extrabold text-xl text-blue-700 bg-blue-50 rounded-lg px-6 py-2 shadow">
          Grand Total: ${invoice.total ? (invoice.total / 100).toFixed(2) : "0.00"}
        </div>
      </div>
    </div>
  );
}

export default Invoice;
