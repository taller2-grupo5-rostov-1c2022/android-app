import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";

const INVALID_FILE_MSG = "Invalid file type";

// File picker para usar con los forms. Props:
// * fileType: tipo de archivo (mime) aceptado
// * button: botón a mostrar para activar el selector de archivos
// * setStatus: función para actualizar el estado del componente
//   lo actualiza con un objeto con propiedades error, file y fileName
//   (error y los otros 2 son excluyentes)
export default function FilePicker(props) {
  const {
    name,
    rules,
    control,
    customProps: { fileType, setStatus, button },
  } = props;

  const { field } = useController({
    name,
    rules,
    control,
  });

  const err = control.getFieldState(name).error?.message;
  useEffect(() => {
    setStatus &&
      setStatus((prev) =>
        prev?.error == INVALID_FILE_MSG ? prev : { error: err }
      );
  }, [err]);

  const getFile = async () => {
    let { type, name, uri, mimeType } = await DocumentPicker.getDocumentAsync({
      type: fileType,
      // copyToCacheDirectory: true,
    });

    if (type != "success") return;

    if (!mimeType || !mimeType.match(fileType)) {
      setStatus && setStatus({ error: INVALID_FILE_MSG });
      field.onChange(null);
      return;
    }

    const file = { name, uri, type: mimeType };
    field.onChange(file);
    setStatus && setStatus({ file: file, fileName: name });
  };

  return React.cloneElement(button, { onPress: getFile });
}

FilePicker.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.shape({
    fileType: PropTypes.string.isRequired,
    setStatus: PropTypes.func,
    button: PropTypes.any.isRequired,
  }).isRequired,
};
