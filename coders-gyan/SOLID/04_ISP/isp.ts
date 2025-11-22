// ISP -> Interface Segregation Principle
// Clients should not be forced to depend upon interfaces that they do not use.

interface DocumentManager {
    openDocument(): void;
    closeDocument(): void;
    saveDocument(): void;
    scanDocument(): void;
}

// class BasicDocumentManager implements DocumentManager {
//     openDocument(): void {
//         console.log("Document opened");
//     }

//     closeDocument(): void {
//         console.log("Document closed");
//     }

//     saveDocument(): void {
//         console.log("Document saved");
//     }

// * BasicDocumentManager does not need to implement scanDocument, but is forced to do so because of the DocumentManager interface, so this is a violation of ISP. now we segregate the interface.
//     scanDocument(): void {
//         console.log("do not do anything");
//     }
// }

interface DocumentOpener {
    openDocument(): void;
}

interface DocumentCloser {
    closeDocument(): void;
}

interface DocumentSaver {
    saveDocument(): void;
}

interface DocumentScanner {
    scanDocument(): void;
}

class BasicDocumentManager
    implements DocumentOpener, DocumentCloser, DocumentSaver
{
    openDocument(): void {
        console.log("Document opened");
    }

    closeDocument(): void {
        console.log("Document closed");
    }

    saveDocument(): void {
        console.log("Document saved");
    }
}

class AdvancedDocumentManager
    implements DocumentOpener, DocumentCloser, DocumentSaver, DocumentScanner
{
    openDocument(): void {
        console.log("Document opened");
    }
    closeDocument(): void {
        console.log("Document closed");
    }
    saveDocument(): void {
        console.log("Document saved");
    }
    scanDocument(): void {
        console.log("Document scanned");
    }
}
