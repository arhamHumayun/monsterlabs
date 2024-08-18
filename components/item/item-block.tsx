import { itemSchemaType } from "@/types/item";

export default function ItemBlock({ item }: { item: itemSchemaType }) {
  const {
    name,
    type,
    subtype,
    rarity,
    requiresAttunement,
    paragraphs,
    description,
  } = item;

  const requiresAttunementTypes = item.requiresAttunement.requiresSpecific;

  const attunement = () => {
    if (requiresAttunement) {
      if (requiresAttunementTypes.length === 0) {
        return '(requires attunement)';
      } else if (requiresAttunementTypes.length === 1) {
        return `(requires attunement by a ${requiresAttunementTypes[0]})`;
      } else if (requiresAttunementTypes.length > 1) {

        const attunementSentence = `${requiresAttunementTypes
          .slice(0, -1)
          .join(', ')} or a ${requiresAttunementTypes.slice(
          -1
        )}`.toLowerCase();

        return `(requires attunement by a ${attunementSentence})`;
      }
    }

    return '';
  };

  const paragraphsList = paragraphs.map((p, i) => (
    <div key={i} className="pb-2">
      <span className="font-bold italic">
        {p.title}
        {`. `}
      </span>
      <span>{p.content}</span>
    </div>
  ));

  return (
    <div className="max-w-3xl mx-auto" id="item-block">
      <div className="p-6 border-2 border-grey-200 rounded duration-700 ease-in-out animate-in fade-in slide-in-from-bottom-4">
        <h1 className="pb-2 text-2xl font-bold">{name}</h1>
        <p className="italic pb-2">{`${type}${
          subtype ? ` (${subtype})` : ''
        }, ${rarity} ${attunement()}`}</p>
        <p className="pb-2">{description}</p>
        {paragraphsList}
      </div>
    </div>
  );
}
