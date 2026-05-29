// src/quotation-module/LinkGenerator.tsx
import { useState } from "react";
import { Button, Input, message } from "antd";

export default function LinkGenerator() {
  const [quotationNo, setQuotationNo] = useState<string>("");
  const [link, setLink] = useState<string>("");

  const generateLink = async () => {
    if (!quotationNo.trim()) return message.error("Enter quotation number!");
    const generated = `${window.location.origin}/printpage?quotationNo=${encodeURIComponent(
      quotationNo
    )}&autoPrint=true`;
    setLink(generated);
    try {
      await navigator.clipboard.writeText(generated);
      message.success("Link generated & copied to clipboard");
    } catch (err) {
      message.success("Link generated (copy failed automatically)");
    }
  };

  return (
    <div style={{ padding: 20, width: 420 }}>
      <h3>Quotation Link Generator</h3>

      <Input
        placeholder="Enter Quotation Number"
        value={quotationNo}
        onChange={(e) => setQuotationNo(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Button type="primary" block onClick={generateLink}>
        Generate Link
      </Button>

      {link && (
        <div style={{ marginTop: 16 }}>
          <p><b>Generated Link</b></p>
          <Input value={link} readOnly style={{ marginBottom: 10 }} />

          <Button
            block
            style={{ marginBottom: 8 }}
            onClick={() => window.open(link, "_blank")}
          >
            Open Print Page
          </Button>

          <div style={{ display: "flex", gap: 8 }}>
            {/* WhatsApp */}
            <Button
              shape="circle"
              title="Share on WhatsApp"
              icon={<img src="https://img.icons8.com/color/20/whatsapp.png" alt="wa" />}
              style={{ background: "#25D366", border: "none" }}
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent("Quotation Link: " + link)}`,
                  "_blank"
                )
              }
            />

            {/* Email */}
            <Button
              shape="circle"
              title="Share by Email"
              icon={<img src="https://img.icons8.com/fluency/20/mail.png" alt="mail" />}
              style={{ background: "#1677ff", border: "none" }}
              onClick={() => {
                const subject = "Quotation Link";
                const body = `Dear Customer,\n\nPlease find your quotation link:\n\n${link}\n\nRegards,\nDsonik Group`;
                window.location.href = `mailto:?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(body)}`;
              }}
            />

            {/* Copy */}
            <Button
              shape="circle"
              title="Copy Link"
              icon={<img src="https://img.icons8.com/ios-glyphs/20/copy.png" alt="copy" />}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link);
                  message.success("Link copied!");
                } catch {
                  // fallback
                  const el = document.createElement("textarea");
                  el.value = link;
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand("copy");
                  document.body.removeChild(el);
                  message.success("Link copied (fallback)!");
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
