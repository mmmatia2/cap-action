// Purpose: scaffold component boundary for grouped export actions and local n8n export wiring.
// Inputs: export handlers, enable flags, and local webhook config. Outputs: export controls block.
import React from "react";
import { FileJson, FileCode2, FileText, File, Share2 } from "lucide-react";

export type ExportPanelProps = {
  disabled: boolean;
  onJson: () => void;
  onMarkdown: () => void;
  onHtml: () => void;
  onPdf: () => void;
  n8nWebhookUrl: string;
  onN8nWebhookUrlChange: (value: string) => void;
  onSendToN8n: () => void;
  n8nBusy?: boolean;
  n8nStatus?: {
    tone: "info" | "error";
    message: string;
  } | null;
};

export function ExportPanel({
  disabled,
  onJson,
  onMarkdown,
  onHtml,
  onPdf,
  n8nWebhookUrl,
  onN8nWebhookUrlChange,
  onSendToN8n,
  n8nBusy = false,
  n8nStatus = null
}: ExportPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={onJson}
          disabled={disabled}
          className="app-button"
        >
          <FileJson size={16} />
          Export JSON
        </button>
        <button
          type="button"
          onClick={onMarkdown}
          disabled={disabled}
          className="app-button"
        >
          <FileText size={16} />
          Export Markdown
        </button>
        <button
          type="button"
          onClick={onHtml}
          disabled={disabled}
          className="app-button"
        >
          <FileCode2 size={16} />
          Export HTML
        </button>
        <button
          type="button"
          onClick={onPdf}
          disabled={disabled}
          className="app-button app-button--primary"
        >
          <File size={16} />
          Export PDF
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="control-group min-w-[320px] flex-1">
          <label htmlFor="n8nWebhookUrl" className="field-label">
            Local n8n webhook URL
          </label>
          <input
            id="n8nWebhookUrl"
            type="text"
            value={n8nWebhookUrl}
            onChange={(event) => onN8nWebhookUrlChange(event.target.value)}
            placeholder="http://localhost:5678/webhook/your-workflow"
            className="app-input"
          />
        </div>
        <button
          type="button"
          onClick={onSendToN8n}
          disabled={disabled || n8nBusy || !n8nWebhookUrl.trim()}
          className="app-button app-button--primary"
        >
          <Share2 size={16} />
          {n8nBusy ? "Sending..." : "Send to n8n"}
        </button>
      </div>

      {n8nStatus?.message ? (
        <p className={n8nStatus.tone === "error" ? "status-banner status-banner--error" : "status-banner"}>
          {n8nStatus.message}
        </p>
      ) : null}
    </div>
  );
}

