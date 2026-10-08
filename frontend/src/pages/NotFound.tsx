import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <main className="not-found">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <h1>Page Not Found</h1>

        <p>
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <Link to="/" className="not-found-button">
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
