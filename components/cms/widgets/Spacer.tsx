// Spacer (spacer): empty vertical space.
import { type P } from "./shared";

export const Spacer = ({ w }: P) => <div style={{ height: Number(w.height) || 0 }} aria-hidden />;
