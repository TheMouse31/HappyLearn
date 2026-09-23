/**
 * Éditeur contentEditable pour consignes / notes / indices (studio missions).
 * Sortie toujours passée par sanitizeRichHtml avant onChange.
 */
import { useEffect, useId, useRef } from "react";
import { RICH_TEXT_COLORS, sanitizeRichHtml } from "../lib/richText";

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: number;
};

function runCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  minHeight = 160,
}: Props) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const editorRef = useRef<HTMLDivElement>(null);
  /** Évite de réécrire le DOM pendant la frappe (boucle value ↔ innerHTML). */
  const lastEmitted = useRef(value);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Ne pas écraser le curseur si l’éditeur a le focus.
    if (document.activeElement === el) return;
    const next = value || "";
    if (el.innerHTML !== next) {
      el.innerHTML = next;
      lastEmitted.current = next;
    }
  }, [value]);

  function emitFromEditor() {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeRichHtml(el.innerHTML);
    // contentEditable vide → souvent un seul <br>.
    const normalized = html === "<br>" ? "" : html;
    if (normalized === lastEmitted.current) return;
    lastEmitted.current = normalized;
    onChange(normalized);
  }

  function apply(command: string, commandValue?: string) {
    if (disabled) return;
    editorRef.current?.focus();
    runCommand(command, commandValue);
    emitFromEditor();
  }

  return (
    <div className={`field rich-editor${disabled ? " is-disabled" : ""}`}>
      <label htmlFor={fieldId}>{label}</label>
      <div className="rich-editor-toolbar" role="toolbar" aria-label={`Formatage · ${label}`}>
        <button type="button" disabled={disabled} onClick={() => apply("bold")} title="Gras">
          <strong>G</strong>
        </button>
        <button type="button" disabled={disabled} onClick={() => apply("italic")} title="Italique">
          <em>I</em>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => apply("underline")}
          title="Souligné"
        >
          <span className="rich-editor-u">S</span>
        </button>
        <span className="rich-editor-sep" aria-hidden />
        {RICH_TEXT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            disabled={disabled}
            className="rich-editor-swatch"
            style={{ background: color.value }}
            title={color.label}
            aria-label={`Couleur ${color.label}`}
            onClick={() => apply("foreColor", color.value)}
          />
        ))}
        <button
          type="button"
          disabled={disabled}
          className="rich-editor-clear"
          title="Enlever la couleur"
          onClick={() => apply("removeFormat")}
        >
          ∅
        </button>
      </div>
      <div
        id={fieldId}
        ref={editorRef}
        className="rich-editor-surface"
        style={{ minHeight }}
        contentEditable={!disabled}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        data-placeholder={placeholder ?? ""}
        suppressContentEditableWarning
        onInput={emitFromEditor}
        onBlur={emitFromEditor}
        onPaste={(event) => {
          event.preventDefault();
          const text =
            event.clipboardData.getData("text/html") ||
            event.clipboardData.getData("text/plain");
          const safe = sanitizeRichHtml(text.replace(/\n/g, "<br>"));
          runCommand("insertHTML", safe || " ");
          emitFromEditor();
        }}
      />
    </div>
  );
}
