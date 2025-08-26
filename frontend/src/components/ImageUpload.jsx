export default function ImageUpload({ file, onChange, preview }) {
    return (
        <div className="form__group field img_group">
            <input
                type="file"
                id="file-upload"
                className="form__field img_field"
                onChange={onChange}
            />
            <label htmlFor="file-upload" className="form__label img_label">
                Imagen de perfil
            </label>
            <label htmlFor="file-upload" className="upload_label">
                Seleccionar archivo
            </label>
            {file && (
                <span style={{ fontSize: '0.9em', color: '#666' }}>
                    Archivo seleccionado: {file.name}
                </span>
            )}
            {preview && (
                <img
                    id="image-preview"
                    src={preview}
                    alt="Vista previa"
                    style={{ maxWidth: 150, marginTop: 10, borderRadius: 8 }}
                />
            )}
        </div>
    );
}
