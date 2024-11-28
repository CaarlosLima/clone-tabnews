import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          flexDirection: "column",
          height: "50vh",
          width: "50vw",
          padding: "16px",
          gap: "4px",
        }}
      >
        <h1 style={{ lineHeight: "24px" }}>Status</h1>

        <StatusInfo />
      </div>
    </div>
  );
}

function StatusInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        Loading...
      </div>
    );
  }

  const { database } = data.dependencies;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={{ paddingLeft: "8px" }}>
        Updated at: <b> {new Date(data.updated_at).toLocaleString("pt-BR")}</b>
      </span>

      <div>
        <h2>Database</h2>

        <div style={{ paddingLeft: "8px" }}>
          <p>Versão: {database.version}</p>
          <p>Conexões abertas: {database.opened_connections}</p>
          <p>Conexões abertas: {database.max_connections}</p>
        </div>
      </div>
    </div>
  );
}
