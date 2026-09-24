export default function Footer() {
  const linkStyle = { border: 0, background: "none", padding: 0, cursor: "pointer", font: "inherit" };
  return <footer className="border-top bg-light footer-bg">
    <div className="container-fluid px-5">
      <div className="row align-items-center">
        <div className="col-md-6 col-sm-6">
          <p className="mb-0 text-muted small">© 2026 JRNY by Journey Realty Group LLC</p>
          </div>
          <div className="col-md-6 col-sm-6 text-md-end">
            <div className="d-flex gap-4 justify-content-md-end listfooter-card">
              <button type="button" className="text-decoration-none text-muted small" style={linkStyle}>Privacy Policy</button>
              <button type="button" className="text-decoration-none text-muted small" style={linkStyle}>Terms</button>
              <button type="button" className="text-decoration-none text-muted small" style={linkStyle}>Compliance</button>
            </div></div></div></div>
  </footer>;
}
