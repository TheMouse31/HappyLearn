type Props = {
  top: string | number;
  bottom: string | number;
  label?: string;
};

export function FractionViz({ top, bottom, label }: Props) {
  return (
    <span className="fraction" aria-label={label ?? `${top} sur ${bottom}`}>
      <span>{top}</span>
      <i />
      <span>{bottom}</span>
    </span>
  );
}
