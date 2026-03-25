import React, {useState, useEffect} from 'react';
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

function BookSidePanel() {
  const [dismissed, setDismissed] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('book-panel-dismissed');
    setDismissed(stored === 'true');
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setExpanded(false);
    localStorage.setItem('book-panel-dismissed', 'true');
  };

  const restore = () => {
    setDismissed(false);
    localStorage.removeItem('book-panel-dismissed');
  };

  if (dismissed) {
    return (
      <button
        className="book-panel-tab"
        onClick={restore}
        aria-label="Show book promotion"
      >
        <span className="book-panel-tab-icon">&#128214;</span>
      </button>
    );
  }

  return (
    <aside
      className={`book-side-panel ${expanded ? 'book-side-panel--expanded' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        className="book-panel-close"
        onClick={dismiss}
        aria-label="Dismiss book promotion"
      >
        &times;
      </button>
      <div className="book-panel-content">
        <div className="book-panel-badge">Get the Book</div>
        <div className="book-panel-icon">&#128214;</div>
        <h3 className="book-panel-title">Docs as Tests</h3>
        <p className="book-panel-tagline">
          Build documentation that stays accurate, reliable, and in sync with your product.
        </p>
        <a href="https://amzn.to/3NEqwAV" className="book-panel-cta" target="_blank" rel="noopener noreferrer">
          Get it on Amazon &rarr;
        </a>
        <Link to="/books/docs-as-tests" className="book-panel-cta" style={{fontSize: '0.72rem', marginTop: '0.1rem', opacity: 0.7}}>
          Learn more
        </Link>
      </div>
    </aside>
  );
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <BookSidePanel />
    </>
  );
}
