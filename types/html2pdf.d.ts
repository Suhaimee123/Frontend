// src/types/html2pdf.d.ts
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number;
    filename?: string;
    image?: { 
      type?: string; 
      quality?: number;
    };
    html2canvas?: { 
      scale?: number;
    };
    jsPDF?: { 
      unit?: string; 
      format?: string; 
      orientation?: 'portrait' | 'landscape';  // Fixed orientation type
    };
  }

  interface Html2PdfStatic {
    from(element: HTMLElement | string): Html2PdfStatic;
    set(options: Html2PdfOptions): Html2PdfStatic;
    save(): Promise<void>;
    output(type: 'blob' | 'datauristring' | 'string'): Promise<Blob | string>;
  }

  function html2pdf(): Html2PdfStatic;

  export default html2pdf;
}
