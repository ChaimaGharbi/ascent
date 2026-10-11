import type { Item } from "../types";
import { AnimatedPicture } from "./AnimatedPicture";

type Props = { id: string; item: Item; checked: boolean; onToggle: (id: string, on: boolean) => void };

export function TickRow({ id, item, checked, onToggle }: Props) {
  return (
    <li className={`row${checked ? " row--done" : ""}${item.climber ? " row--climber" : ""}`}>
      <AnimatedPicture img={item.img} alt={item.text} />
      <label htmlFor={id}>
        <span className="row__text">{item.text}</span>
        {item.tip && <small>{item.tip}</small>}
      </label>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onToggle(id, e.target.checked)} />
    </li>
  );
}
