import { Buffer } from "buffer";
import piexif from "piexifjs";

export default writeMetadata = async (base64, location) => {
  let data = Buffer.from(base64, "base64").toString("binary");
  let exif = piexif.load(data);

  exif.GPS[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(
    location.latitude
  );
  exif.GPS[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(
    location.longitude
  );

  let bytes = piexif.dump(exif);

  const result = piexif.insert(bytes, data);

  let show = piexif.load(result);

  return result;
};
