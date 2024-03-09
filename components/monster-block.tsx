import {
  monsterSchemaType,
  sizeToHitDice,
  skillToStat,
  statToBonus,
  damageTakenModifiersType,
  speedType,
  savingThrowsType,
  statsType,
  skillsType,
  challengeRatingToXP
} from '@/types/monster';
import { Separator } from './ui/separator';

export default function MonsterBlock(monsterData: monsterSchemaType) {
  const {
    name,
    lore,
    appearance,
    stats,
    hitDiceAmount,
    armorClass,
    size,
    type,
    alignment,
    challengeRating,
    speed,
    savingThrows,
    skills,
    senses,
    conditionImmunities,
    languages,
    damageTakenModifiers,
    traits,
    legendary,
  } = monsterData as monsterSchemaType;

  const conBonus = statToBonus(stats.constitution);

  const proficiencyBonus = Math.floor(challengeRating / 4) + 2;

  const hitDiceSize = sizeToHitDice[size];
  const totalConHpBonus = conBonus * hitDiceAmount;
  const maxHp =
    Math.floor(hitDiceAmount * ((hitDiceSize + 1) / 2)) + totalConHpBonus;

  const { vulnerabilities, resistances, immunities } =
    sortDamageTakenModifiers(damageTakenModifiers);

  return (
    <div>
      <p className="text-xl pb-4 italic">{lore}</p>
      {/* <p className="text-xl pb-4 italic">{appearance}</p> */}
      <div className="p-6 border-2 border-gray-200 rounded-lg">
        <h1 className="pb-2 text-2xl font-bold">{name}</h1>
        <p className="italic">
          {capitalizeFirstLetter(`${size} ${type}, ${alignment}`)}
        </p>
        <Separator className="my-4" />
        <StyledStatSentences s1="Armor Class" s2={armorClass.base.toString()} />
        <StyledStatSentences
          s1="Hit Points"
          s2={`${maxHp} (${hitDiceAmount}d${hitDiceSize}) + ${totalConHpBonus}`}
        />
        <StyledStatSentences s1="Speed" s2={buildSpeedStringResult(speed)} />
        <Separator className="my-4" />
        <StatsBlock stats={stats} />
        <Separator className="my-4" />
        <StyledStatSentences
          s1="Saving Throws"
          s2={buildSavingThrowsStringResult(
            savingThrows,
            stats,
            proficiencyBonus
          )}
        />
        <StyledStatSentences
          s1="Skills"
          s2={buildSkillsStringResult(skills, stats, proficiencyBonus)}
        />
        <StyledStatSentences
          s1="Damage Vulnerabilities"
          s2={buildDamageTakenModifiersString(vulnerabilities)}
        />
        <StyledStatSentences
          s1="Damage Resistances"
          s2={buildDamageTakenModifiersString(resistances)}
        />
        <StyledStatSentences
          s1="Damage Immunities"
          s2={buildDamageTakenModifiersString(immunities)}
        />
        <StyledStatSentences
          s1="Condition Immunities"
          s2={Object.keys(conditionImmunities).join(', ')}
        />
        <StyledStatSentences
          s1="Senses"
          s2={Object.entries(senses)
            .filter(([_, value]) => value)
            .map(([sense, value]) => `${sense} ${value} ft.`)
            .join(', ')}
        />
        <StyledStatSentences
          s1="Languages"
          s2={Object.keys(languages).filter(lang => lang !== "telepathy").join(', ') + (languages.telepathy ? `, telepathy ${languages.telepathy.range} ft.` : '')}
        />
        <StyledStatSentences
          s1="Challenge"
          s2={`${challengeRating.toString()} (${challengeRatingToXP[
            challengeRating
          ].toLocaleString()} XP)`}
        />
        <Separator className="my-4" />
        {traits.map((trait, index) => (
          <StyledTraitSentences
            key={index}
            s1={`${trait.name}.`}
            s2={trait.description}
          />
        ))}
        {legendary?.resistance ? (
          <StyledTraitSentences
            s1={`Legendary Resistance (${legendary.resistance}/Day).`}
            s2={`If${monsterData.isUnique ? "" : " the" } ${name} fails a saving throw, it can choose to succeed instead.`}
          />
        ) : null}
        <h1 className="mt-4 text-xl font-semibold">Actions</h1>
        <Separator className="mb-4" />
        {actionSection(monsterData, proficiencyBonus)}
        {reactionActionSection(monsterData)}
        {legendaryActionSelection(monsterData)}
      </div>
    </div>
  );
}

const reactionActionSection = (monsterData: monsterSchemaType) => {
  const { reactions } = monsterData;

  if (!reactions) {
    return null;
  }

  const separator = (
    <div>
      <h1 className="mt-4 text-xl font-semibold">Reactions</h1>
      <Separator className="mb-4" />
    </div>
  )

  const actionMap = reactions.map((action, index) => {
    const { name, description } = action;
    return (
      <div key={index} className='mb-4'>
        <p>
          <span className="font-semibold italic">{name}. </span>
          <span className=''>{description}</span>
        </p>
      </div>
    );
  }
  );

  return (
    <div>
      {separator}
      {actionMap}
    </div>
  );
}

const legendaryActionSelection = (monsterData: monsterSchemaType) => {
  const { legendary } = monsterData;

  if (!legendary) {
    return null;
  }

  const separator = (
    <div>
      <h1 className="mt-4 text-xl font-semibold">Legendary Actions</h1>
      <Separator className="mb-4" />
      <p className='mb-4'>{`${monsterData.isUnique ? "" : "The " }${monsterData.name} can take ${legendary.actionsPerTurn} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. ${monsterData.isUnique ? "" : "The " }${monsterData.name} regains spend legendary actions at the start of ${monsterData.isUnique ? "their " : "its " } turn.`}</p>
    </div>
  )

  const actionMap = legendary.actions.map((action, index) => {
    const { name, cost, description } = action;

    return (
      <div key={index} className='mb-4'>
        <p>
          <span className="font-semibold italic">{name}{cost && cost > 1 ? ` (Costs ${cost} Actions)` : ``}. </span>
          <span className=''>{description}</span>
        </p>
      </div>
    );
  }
  );

  return (
    <div>
      {separator}
      {actionMap}
    </div>
  );
}

const actionSection = (monsterData: monsterSchemaType, proficiencyBonus: number) => {
  const { actions } = monsterData;

  const {
    targetedWeaponAttacks,
    savingThrowAttacks,
    specialActions,
    multiAttack
  } = actions;

  const actionUI = [];

  if (multiAttack) {
    actionUI.push(
      <div key={0} className='mb-4'>
        <p>
          <span className="font-semibold italic">Multiattack. </span>
          <span>{actions.multiAttack}</span>
        </p>
      </div>
    );
  }

  if (targetedWeaponAttacks) {
    const targetedWeaponAttacksUI = targetedWeaponAttacks.map(
      (action, index) => {
        
        const { name, attackStat, attackType, targetCount, hit, range, recharge } = action;

        if (!hit) {
          return null;
        }

        const { damage } = hit;

        const attackBonus =  statToBonus(monsterData.stats[attackStat]) + proficiencyBonus;
        const sign = attackBonus > 0 ? '+' : '';
        const targetCountDescription = targetCount > 1 ? `up to ${targetCount} targets` : 'one target';

        const meleeAttackDescription = range.melee && range.melee > 0 ?`${sign}${attackBonus} to hit, reach ${range.melee} ft., ${targetCountDescription}.` : null;
        const rangedAttackDescription = range.ranged && range.ranged > 0 ? `${sign}${attackBonus} to hit, range ${range.ranged}/${range.ranged*4} ft., ${targetCountDescription}.` : null;

        const attackDescriptionPrefix = () => {
          const attackTypeDescription = attackType.charAt(0).toUpperCase() + attackType.slice(1);
          if (meleeAttackDescription && rangedAttackDescription) {
            return `Melee or Ranged ${attackTypeDescription} Attack: `;
          }
          else if (meleeAttackDescription) {
            return `Melee ${attackTypeDescription} Attack: `;
          }
          else if (rangedAttackDescription) {
            return `Ranged ${attackTypeDescription} Attack: `;
          }
          return ``;
        }

        const attackDescription = () => {
          if (meleeAttackDescription && rangedAttackDescription) {
            return `${meleeAttackDescription} or ${rangedAttackDescription}`;
          }
          if (meleeAttackDescription) {
            return meleeAttackDescription;
          }
          if (rangedAttackDescription) {
            return rangedAttackDescription;
          }
          return null;
        }

        const damageDescription = () => {
          if (damage) {
            const damageBonus = statToBonus(monsterData.stats[attackStat]);
            const sign = damageBonus > 0 ? '+' : '';
            const averageDamage = (damage.primary.damageDice.count * (damage.primary.damageDice.sides + 1)) / 2 + damageBonus;
            const averageDamageSecondary = damage.secondary ? (damage.secondary.damageDice.count * (damage.secondary.damageDice.sides + 1)) / 2 : 0;
            
            return `${averageDamage} (${damage.primary.damageDice.count}d${damage.primary.damageDice.sides} ${sign} ${damageBonus}) ${damage.primary.damageType} damage${damage.secondary ? `, plus ${averageDamageSecondary} (${damage.secondary.damageDice.count}d${damage.secondary.damageDice.sides}) ${damage.secondary.damageType} damage` : ''}.`;
          } 
          return ``;
        }

        const conditionsDescription = hit.affect ? ` ${hit.affect}` : '.';

        const rechargeDescription = recharge ? ` (Recharge ${recharge}-6)` : '';

        return (
          <div key={index} className='mb-4'>
            <p>
              <span className="font-semibold italic">{name}{rechargeDescription}. </span>
              <span className='italic'>{attackDescriptionPrefix()}</span>
              {attackDescription()}
              <span className='italic'> Hit: </span>
              {damageDescription()}{conditionsDescription}
            </p>
          </div>
        );
      }
    );
    actionUI.push(targetedWeaponAttacksUI);
  }

  if (savingThrowAttacks) {
    const saveAttacksUI = savingThrowAttacks.map((action, index) => {
      const { name, recharge, description } = action;
      return (
        <div key={index} className='mb-4'>
          <p>
            <span className="font-semibold italic">{name}{recharge ? ` (Recharge ${recharge}-6)` : ''}. </span>
            <span className=''>{description}.</span>
          </p>
        </div>
      );
    });
    actionUI.push(saveAttacksUI);
  }

  if (specialActions) {
    const specialActionsUI = specialActions.map((action, index) => {
      const { name, description } = action;
      return (
        <div key={index} className='mb-4'>
          <p>
            <span className="font-semibold italic">{name}. </span>
            <span className=''>{description}</span>
          </p>
        </div>
      );
    });
    actionUI.push(specialActionsUI);
  }

  return actionUI;
}

function StatsBlock({ stats }: { stats: statsType }) {
  const statBlocks = Object.entries(stats).map(([stat, value]) => {
    const bonus = statToBonus(value);
    const sign = bonus > 0 ? '+' : '';

    const short = stat.slice(0, 3).toUpperCase();

    return (
      <div key={short} className="shrink">
        <div className="text-center font-semibold">{short}</div>
        <div className="text-center">{`${value} (${sign}${bonus})`}</div>
      </div>
    );
  });

  return <div className="grid grid-cols-6 gap-2 flex">{statBlocks}</div>;
}

function StyledTraitSentences({ s1, s2 }: { s1: string; s2: string }) {
  if (s2 === '') {
    return null;
  }

  return (
    <div className='mb-2'>
      <span className="font-semibold italic">{s1} </span>
      <span>{s2}</span>
    </div>
  );
}

function StyledStatSentences({ s1, s2 }: { s1: string; s2: string }) {
  if (s2 === '') {
    return null;
  }

  return (
    <div>
      <span className="font-semibold">{s1} </span>
      <span>{s2}</span>
    </div>
  );
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const buildSpeedStringResult = (speed: speedType) => {
  let result = '';
  let key: keyof speedType;
  for (key in speed as speedType) {
    result += `${key} ${speed[key]} ft., `;
  }
  result = result.slice(0, -2);
  return result;
};

const buildSavingThrowsStringResult = (
  savingThrows: savingThrowsType,
  stats: statsType,
  proficiencyBonus: number
) => {
  let result = '';
  let key: keyof savingThrowsType;
  for (key in savingThrows) {
    if (savingThrows[key]) {
      const bonusName = key.charAt(0).toUpperCase() + key.slice(1, 3);
      const bonusSign = statToBonus(stats[key]) > 0 ? '+' : '';
      const bonusAmount = statToBonus(stats[key]) + proficiencyBonus;

      result += `${bonusName} ${bonusSign}${bonusAmount}, `;
    }
  }
  result = result.slice(0, -2);
  return result;
};

const buildSkillsStringResult = (
  skills: skillsType,
  stats: statsType,
  proficiencyBonus: number
) => {
  let result = '';
  let key: keyof skillsType;
  for (key in skills) {
    if (skills[key]) {
      const stat = skillToStat[key] as keyof statsType;
      const statScore = stats[stat];

      const bonusName = key.charAt(0).toUpperCase() + key.slice(1);
      const bonusSign = statToBonus(statScore) > 0 ? '+' : '';
      const bonusAmount = statToBonus(statScore) + proficiencyBonus;

      result += `${bonusName} ${bonusSign}${bonusAmount}, `;
    }
  }
  result = result.slice(0, -2);
  return result;
};

const buildDamageTakenModifiersString = (
  modifiers: Partial<damageTakenModifiersType>
) => {
  let result = '';
  let resultPhysicalList = [];
  let key: keyof typeof modifiers;
  for (key in modifiers) {
    if (
      key === 'nonMagicalBludgeoning' ||
      key === 'nonMagicalSlashing' ||
      key === 'nonMagicalPiercing'
    ) {
      const updatedKey = (key as string).slice(10).toLowerCase();
      resultPhysicalList.push(updatedKey);
    } else if (
      key === 'magicalBludgeoning' ||
      key === 'magicalSlashing' ||
      key === 'magicalPiercing'
    ) {
      const updatedKey = (key as string).slice(7).toLowerCase();
      result += `${updatedKey}, `;
    } else {
      result += `${key}, `;
    }
  }

  result = result.slice(0, -2);
  if (resultPhysicalList.length === 0) {
    return result;
  }

  if (resultPhysicalList.length > 1) {
    resultPhysicalList[resultPhysicalList.length - 1] = `and ${
      resultPhysicalList[resultPhysicalList.length - 1]
    }`;
  }

  result += `${result.length > 0 ? `; ` : ``} ${resultPhysicalList.join(', ')} from nonmagical attacks.`;
  return result;
};

function sortDamageTakenModifiers(
  damageTakenModifiers: damageTakenModifiersType
) {
  let vulnerabilities: Partial<damageTakenModifiersType> = {};
  let resistances: Partial<damageTakenModifiersType> = {};
  let immunities: Partial<damageTakenModifiersType> = {};

  let key: keyof damageTakenModifiersType;
  for (key in damageTakenModifiers) {
    let value = damageTakenModifiers[key];

    if (value === 'vulnerability') {
      vulnerabilities[key] = value;
    } else if (value === 'resistance') {
      resistances[key] = value;
    } else if (value === 'immunity') {
      immunities[key] = value;
    }
  }

  return { vulnerabilities, resistances, immunities };
}
