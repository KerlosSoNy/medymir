import Link from "next/link";
import { UI } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h1>404</h1>
      <p>{UI.notFound}</p>
      <Link href="/" className="btn btn-dark">
        {UI.backHome}
      </Link>
    </div>
  );
}
