const COLOR_FOREST_WOLF = "#e5e1db";

export const PDF_NOTE_CSS = `
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 32px;
    background-color: ${COLOR_FOREST_WOLF};
    color: #000000;
    line-height: 1.6;
  }

  .markdown__h1, .markdown__h2, .markdown__h3, .markdown__h4, .markdown__h5, .markdown__h6 {
    display: block;
    font-weight: 700;
    margin: 0;
  }
    
  .markdown__h1:not(:first-child) {
    margin-top: 24px;
  }
    
  .markdown__h2:not(:first-child) {
    margin-top: 20px;
  }
    
  .markdown__h3:not(:first-child) {
    margin-top: 16px;
  }
    
  .markdown__h4:not(:first-child), .markdown__h5:not(:first-child), .markdown__h6:not(:first-child) {
    margin-top: 14px;
  }
    
  .markdown__h1 {
    font-size: 32px;
    line-height: 38px;
  }
    
  .markdown__h2 {
    font-size: 24px;
    line-height: 30px;
  }
    
  .markdown__h3 {
    font-size: 19px;
    line-height: 25px;
  }
    
  .markdown__h4 {
    font-size: 16px;
    line-height: 22px;
  }
    
  .markdown__h5 {
    font-size: 13px;
    line-height: 18px;
  }
    
  .markdown__h6 {
    font-size: 11px;
    line-height: 15px;
  }
    
  .markdown__p {
    margin: 0;
    font-size: 18px;
    line-height: 24px;
  }
    
  .markdown__p:not(:first-child) {
    margin: 24px 0 0;
  }
`;
