"use client";

import { useToken } from "../../common/hooks/useToken";

export default function App() {
  const { parseToken } = useToken();
  const claims = parseToken();
  const role = claims["role"];

  switch (role) {
    case "superadmin":
      return <div>Superadmin dashboard</div>;
    case "pengajar":
      return <div>pengajar dashboard</div>;
    case "operasional":
      return <div>operasional dashboard</div>;
    case "akademik":
      return <div>akademik dashboard</div>;
    default:
      return <div>akademik NULL</div>;
  }
}
