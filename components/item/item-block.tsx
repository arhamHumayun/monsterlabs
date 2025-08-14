import { itemsDocument } from '@/types/db/item';
import Image from 'next/image';

export default function ItemBlock({ item, currentImageUrl }: { item: itemsDocument, currentImageUrl: string | null }) {
  const {
    name,
    type,
    subtype,
    rarity,
    requires_attunement,
    requires_attunement_specific,
    paragraphs,
    description,
    cost_amount,
    weight
  } = item;

  const attunementSentence = () => {
    if (requires_attunement) {
      if (requires_attunement_specific) {
        return `(${requires_attunement_specific})`;
      }
      return `(requires attunement)`;
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
      <div className="col-span-2">
        <div className="p-6 border-2 border-grey-200 rounded duration-700 ease-in-out animate-in fade-in slide-in-from-bottom-4">
          <h1 className="pb-2 text-2xl font-bold">{name}</h1>
          <p className="italic pb-2">
            {`${type}${
              subtype ? ` (${subtype})` : ''
            }, ${rarity} ${attunementSentence()}`}
          </p>
          {currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt="Item Image"
              width={1024}
              height={1024}
              className="rounded-lg my-2"
            />
          ) : null}
          <p className="pb-2">{description}</p>
          {paragraphsList}
        </div>
        <p className="mt-2">
          <span className="font-semibold">Cost: </span>
          {cost_amount} gp,
          <span className="font-semibold"> Weight: </span>
          {weight} lb{weight > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
