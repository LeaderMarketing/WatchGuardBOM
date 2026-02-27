import React, { useState } from 'react';
import {
  EnvelopeSimple,
  FilePdf,
  Package,
  ShoppingCartSimple,
  Spinner,
  Storefront,
  Trash,
  X,
} from '@phosphor-icons/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from './QuoteCartPanel.module.css';
import { useQuote } from '../../context/QuoteContext';
import { formatPrice } from '../../data/productPrices.js';
import { addMultipleToCart } from '../../data/cartUtils.js';

// Dummy Account Managers - replace with actual names later
const accountManagers = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
  { id: 3, name: 'Michael Chen', email: 'michael.chen@example.com' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: 5, name: 'David Wilson', email: 'david.wilson@example.com' },
];

function QuoteCartPanel({ isOpen, onClose }) {
  const { state, removeItem, updateQuantity, clearCart, setCustomerInfo, setNotes } = useQuote();
  const { items, subtotal, itemCount, customerInfo, notes } = state;

  const [selectedAM, setSelectedAM] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showQuoteOptions, setShowQuoteOptions] = useState(false);

  const hasItems = items.length > 0;

  // Generate PDF Quote
  const handleDownloadPDF = async () => {
    if (!hasItems) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header with WatchGuard Red
      doc.setFillColor(194, 24, 24);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('WatchGuard Quote', 14, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString('en-AU')}`, pageWidth - 14, 25, { align: 'right' });

      // Customer Info
      let yPos = 50;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Quote Details', 14, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (customerInfo.name) {
        doc.text(`Customer: ${customerInfo.name}`, 14, yPos);
        yPos += 6;
      }
      if (customerInfo.email) {
        doc.text(`Email: ${customerInfo.email}`, 14, yPos);
        yPos += 6;
      }

      const selectedManager = accountManagers.find((am) => am.id === parseInt(selectedAM));
      if (selectedManager) {
        doc.text(`Account Manager: ${selectedManager.name}`, 14, yPos);
        yPos += 6;
      }

      yPos += 10;

      // Items Table
      const tableData = items.map((item) => [
        item.sku,
        item.name,
        item.description,
        item.quantity.toString(),
        item.unitPrice > 0 ? `$${item.unitPrice.toLocaleString()}` : 'TBC',
        item.unitPrice > 0 ? `$${(item.unitPrice * item.quantity).toLocaleString()}` : 'TBC',
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['SKU', 'Product', 'Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [194, 24, 24],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 40 },
          3: { halign: 'center', cellWidth: 15 },
          4: { halign: 'right', cellWidth: 25 },
          5: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
        },
        margin: { left: 14, right: 14 },
      });

      // Summary
      const finalY = doc.lastAutoTable.finalY + 10;

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(pageWidth - 80, finalY, 66, 25, 3, 3, 'F');

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Quote Total (ex GST):', pageWidth - 76, finalY + 10);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(194, 24, 24);
      doc.text(subtotal > 0 ? `$${subtotal.toLocaleString()}` : 'TBC', pageWidth - 76, finalY + 20);

      // Notes
      if (notes) {
        const notesY = finalY + 35;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('Notes:', 14, notesY);

        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(notes, pageWidth - 28);
        doc.text(splitNotes, 14, notesY + 6);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('This quote is for reference only. Final pricing subject to confirmation.', 14, pageHeight - 15);
      doc.text('Powered by Leader Systems - WatchGuard Configurator', 14, pageHeight - 10);

      // Save
      const fileName = `WatchGuard-Quote-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Add all quote items to the real Leader Systems shopping cart
  const [addingToLeaderCart, setAddingToLeaderCart] = useState(false);
  const [leaderCartMessage, setLeaderCartMessage] = useState('');

  const handleAddAllToLeaderCart = async () => {
    if (!hasItems || addingToLeaderCart) return;

    // Map quote cart items to configurations for addMultipleToCart
    const configurations = items.map((item) => {
      const descParts = item.description.match(/^(.+?)\s*\((.+?)\)$/);
      if (descParts) {
        return {
          productName: item.name,
          serviceType: descParts[1],
          term: descParts[2],
          quantity: item.quantity,
        };
      }
      return {
        productName: item.name,
        serviceType: item.description,
        term: null,
        quantity: item.quantity,
      };
    });

    setAddingToLeaderCart(true);
    setLeaderCartMessage('Adding items to Leader Cart...');

    try {
      const result = await addMultipleToCart(configurations);
      setLeaderCartMessage(result.message);
      setTimeout(() => setLeaderCartMessage(''), 6000);
    } catch {
      setLeaderCartMessage('Failed to add items — unexpected error.');
      setTimeout(() => setLeaderCartMessage(''), 6000);
    } finally {
      setAddingToLeaderCart(false);
    }
  };

  // Email to Account Manager
  const handleEmailAM = () => {
    if (!hasItems || !selectedAM) return;

    const selectedManager = accountManagers.find((am) => am.id === parseInt(selectedAM));
    if (!selectedManager) return;

    const itemsList = items
      .map(
        (item) =>
          `- ${item.sku}: ${item.name} (${item.description}) x${item.quantity}${item.unitPrice > 0 ? ` = $${(item.unitPrice * item.quantity).toLocaleString()}` : ''}`
      )
      .join('%0A');

    const emailBody = `Hi ${selectedManager.name},%0A%0AI would like to request a quote for the following WatchGuard products:%0A%0A${itemsList}%0A%0A${subtotal > 0 ? `Quote Total (ex GST): $${subtotal.toLocaleString()}%0A` : ''}%0A${customerInfo.name ? `Customer Name: ${customerInfo.name}%0A` : ''}${customerInfo.email ? `Customer Email: ${customerInfo.email}%0A` : ''}${notes ? `%0ANotes: ${notes}%0A` : ''}%0APlease confirm availability and pricing.%0A%0AThank you.`;

    const subject = `WatchGuard Quote Request - ${new Date().toLocaleDateString('en-AU')}`;
    window.location.href = `mailto:${selectedManager.email}?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className={styles.modalOverlay} onClick={onClose} />

      {/* Modal Content */}
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>
            <ShoppingCartSimple size={20} weight="fill" />
            Quote Cart
          </h2>
          <div className={styles.headerActions}>
            {hasItems && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearCart}
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close cart"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {!hasItems ? (
            <div className={styles.emptyCart}>
              <span className={styles.emptyIcon}>
                <ShoppingCartSimple size={40} weight="duotone" />
              </span>
              <p>Your quote cart is empty</p>
              <span className={styles.emptyHint}>
                Configure a product and click "Add to Quote" to build your quote.
              </span>
            </div>
          ) : (
            <>
              {/* Cart Table */}
              <div className={styles.tableContainer}>
                <table className={styles.cartTable}>
                  <thead>
                    <tr>
                      <th className={styles.thumbCol}>Item</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th className={styles.priceCol}>Unit Price</th>
                      <th className={styles.qtyCol}>Qty</th>
                      <th className={styles.subtotalCol}>Subtotal</th>
                      <th className={styles.actionCol}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.thumbCol}>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className={styles.itemThumb}
                            />
                          ) : (
                            <div className={styles.itemThumbPlaceholder}>
                              <Package size={22} weight="duotone" />
                            </div>
                          )}
                        </td>
                        <td>
                          <div className={styles.productInfo}>
                            {item.productUrl ? (
                              <a
                                href={item.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.productLink}
                              >
                                <span className={styles.productName}>{item.name}</span>
                              </a>
                            ) : (
                              <span className={styles.productName}>{item.name}</span>
                            )}
                            <span className={styles.productDesc}>{item.description}</span>
                          </div>
                        </td>
                        <td>
                          <code className={styles.skuCode}>{item.sku}</code>
                        </td>
                        <td className={styles.priceCol}>
                          {formatPrice(item.unitPrice)}
                        </td>
                        <td className={styles.qtyCol}>
                          <div className={styles.qtyControl}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className={styles.subtotalCol}>
                          <span className={styles.lineTotal}>
                            {item.unitPrice > 0
                              ? formatPrice(item.unitPrice * item.quantity)
                              : 'TBC'}
                          </span>
                        </td>
                        <td className={styles.actionCol}>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cart Summary */}
              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Items in Cart:</span>
                  <span>{itemCount}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total (ex GST):</span>
                  <span className={styles.totalValue}>
                    {subtotal > 0 ? formatPrice(subtotal) : 'TBC'}
                  </span>
                </div>
              </div>

              {/* Quote Options Toggle */}
              <button
                type="button"
                className={styles.optionsToggle}
                onClick={() => setShowQuoteOptions(!showQuoteOptions)}
              >
                {showQuoteOptions ? '▼ Hide Quote Options' : '▶ Quote Options'}
              </button>

              {/* Quote Options */}
              {showQuoteOptions && (
                <div className={styles.quoteOptions}>
                  <div className={styles.optionsGrid}>
                    <div className={styles.inputGroup}>
                      <label>Customer Name (optional)</label>
                      <input
                        type="text"
                        placeholder="Enter customer name..."
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ name: e.target.value })}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Customer Email (optional)</label>
                      <input
                        type="email"
                        placeholder="Enter customer email..."
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Notes</label>
                    <textarea
                      placeholder="Add any notes..."
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Account Manager</label>
                    <select
                      value={selectedAM}
                      onChange={(e) => setSelectedAM(e.target.value)}
                    >
                      <option value="">Select Account Manager...</option>
                      {accountManagers.map((am) => (
                        <option key={am.id} value={am.id}>
                          {am.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {hasItems && (
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.leaderCartBtn}
              onClick={handleAddAllToLeaderCart}
              disabled={addingToLeaderCart}
              title="Add all items to the real Leader Systems shopping cart"
            >
              <Storefront size={18} weight="bold" />
              {addingToLeaderCart ? 'Adding...' : 'Add All to Leader Cart'}
            </button>
            {leaderCartMessage && (
              <div className={styles.leaderCartMsg}>{leaderCartMessage}</div>
            )}
            <button
              type="button"
              className={styles.emailBtn}
              onClick={handleEmailAM}
              disabled={!selectedAM}
            >
              <EnvelopeSimple size={18} weight="bold" />
              Email to AM
            </button>
            <button
              type="button"
              className={styles.pdfBtn}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>
                  <Spinner size={18} className={styles.spin} />
                  Generating...
                </>
              ) : (
                <>
                  <FilePdf size={18} weight="bold" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default QuoteCartPanel;
