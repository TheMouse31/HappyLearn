/**
 * Grille de choix de scène d’étape (auto / bibliothèque perso / animées).
 * Peut injecter un groupe « library » vide pour exposer « + Nouvelle ».
 */
import {
  SCENE_GROUP_LABELS,
  groupSceneOptions,
  type SceneOption,
} from "../lib/illustrations";

type Props = {
  options: SceneOption[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  /** Ouvre le panneau de création d’illustration (studio / admin). */
  onCreateRequest?: () => void;
};

export function ScenePicker({ options, value, disabled, onChange, onCreateRequest }: Props) {
  const base = groupSceneOptions(options);
  const hasLibrary = base.some((entry) => entry.group === "library");
  // Sans aucune perso, on force quand même la section bibliothèque si création possible.
  const groups =
    onCreateRequest && !hasLibrary
      ? [
          ...base.filter((entry) => entry.group === "auto"),
          { group: "library" as const, items: [] as SceneOption[] },
          ...base.filter((entry) => entry.group === "animated"),
        ]
      : base;

  return (
    <div className="scene-picker">
      {groups.map(({ group, items }) => (
        <section key={group} className="scene-picker-group">
          <div className="scene-picker-group-head">
            <h4>{SCENE_GROUP_LABELS[group]}</h4>
            {group === "library" && onCreateRequest && !disabled ? (
              <button type="button" className="scene-picker-create" onClick={onCreateRequest}>
                + Nouvelle
              </button>
            ) : null}
          </div>
          <div className="scene-picker-grid" role="listbox" aria-label={SCENE_GROUP_LABELS[group]}>
            {items.map((option) => {
              const selected = (value || "") === option.value;
              return (
                <button
                  key={option.value || "auto"}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`scene-pick${selected ? " is-selected" : ""}${option.group === "library" ? " is-library" : ""}`}
                  disabled={disabled}
                  onClick={() => onChange(option.value)}
                >
                  <span className={`scene-pick-thumb tone-${option.tone}`} aria-hidden>
                    {option.thumb ? (
                      <img src={option.thumb} alt="" />
                    ) : (
                      <span className="scene-pick-glyph">{option.value || "★"}</span>
                    )}
                  </span>
                  <span className="scene-pick-meta">
                    <strong>{option.label}</strong>
                    <span>{option.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {group === "library" && items.length === 0 ? (
            <p className="field-help">
              Aucune illustration perso.{" "}
              {onCreateRequest && !disabled ? (
                <button type="button" className="text-link" onClick={onCreateRequest}>
                  Créer la première
                </button>
              ) : (
                "Crée-en dans la bibliothèque."
              )}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
