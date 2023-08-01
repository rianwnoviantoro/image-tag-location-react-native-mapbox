import { Buffer } from "buffer";
import piexif from "piexifjs";

export default writeMetadata = async (base64, location) => {
  let data = Buffer.from(base64, "base64").toString("binary");
  let exif = piexif.load(data);

  console.log("Before: ", exif.GPS);

  exif.GPS[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(
    location.latitude
  );
  exif.GPS[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(
    location.longitude
  );

  console.log("Inject: ", exif.GPS);

  let bytes = piexif.dump(exif);

  const result = piexif.insert(bytes, data);

  let show = piexif.load(result);

  console.log("After: ", show.GPS);

  return result;
};
