import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";

const INVALID_FILE_MSG = "Invalid file type";

// File picker para usar con los forms. Props:
// * fileType: tipo de archivo (mime) aceptado
// * button: botón a mostrar para activar el selector de archivos
// * setFileName (opcional): función que se llama cuando se selecciona un archivo con su nombre
// * setError (opcional): función que se llama cuando hay un error con su descripción
export default function FilePicker(props) {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    customProps: { fileType, setFileName, setError, button },
  } = props;

  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  useEffect(() => {
    const err = control.getFieldState(name).error?.message;
    setError((prev) => (prev == INVALID_FILE_MSG ? prev : err));
  });

  const getFile = async () => {
    let { type, name, uri, mimeType } = await DocumentPicker.getDocumentAsync({
      type: fileType,
      // copyToCacheDirectory: true,
    });

    if (type != "success") return;

    if (!mimeType || !mimeType.match(fileType)) {
      setError && setError(INVALID_FILE_MSG);
      setFileName && setFileName(null);
      field.onChange(null);
      return;
    }

    field.onChange({ name, uri, type: mimeType });
    setError && setError(null);
    setFileName && setFileName(name);
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
    setFileName: PropTypes.func,
    setError: PropTypes.func,
    button: PropTypes.any.isRequired,
    buttonProps: PropTypes.any,
  }).isRequired,
};
