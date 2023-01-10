export function callToastify(text, color) {
    Toastify({

        text: text,
        duration: 2000,
        position: "center",
        style: {
            background: color,
            "font-size": "14px",
            "line-height": "17px",
            "font-weight": "700",
            "padding": "20px 40px",
            "border-radius": "10px",
            "max-width": "207px",
            "text-align": "center"
        }
        
        }).showToast();
}
