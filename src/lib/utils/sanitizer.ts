import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHTML = (dirty: string) => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 'blockquote',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'video', 'u', 's'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'class', 'style', 'controls', 'width', 'height']
    });
};
