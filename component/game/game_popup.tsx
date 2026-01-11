
export default function Popup({ id, children, onClose }: { id: string, children: any, onClose: any }) {
    return (
        <div id={id} className="popup-background hidden">
            <div className="popup-container relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                {children}
            </div>
        </div>
    );
}
