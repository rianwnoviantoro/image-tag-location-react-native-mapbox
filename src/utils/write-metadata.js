import { Buffer } from "buffer";
var piexif = require("piexifjs");

export default writeMetadata = async (base64, location) => {
  const latitudeRef = location.latitude >= 0 ? "N" : "S";
  const longitudeRef = location.longitude >= 0 ? "E" : "W";
  const gpsAltitudeRef = location.altitude >= 0 ? 0 : 1;

  const data = Buffer.from(base64, "base64").toString("binary");
  const exif = piexif.load(data);

  exif.GPS[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(
    location.latitude
  );
  exif.GPS[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(
    location.longitude
  );
  exif.GPS[piexif.GPSIFD.GPSLatitudeRef] = latitudeRef;
  exif.GPS[piexif.GPSIFD.GPSLongitudeRef] = longitudeRef;
  exif.GPS[piexif.GPSIFD.GPSAltitude] = Math.abs(location.altitude);
  exif.GPS[piexif.GPSIFD.GPSAltitudeRef] = gpsAltitudeRef;
  exif.GPS[piexif.GPSIFD.GPSSpeed] = location.speed;
  exif.GPS[piexif.GPSIFD.GPSTimeStamp] = [
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
  ];

  const bytes = piexif.dump(exif);

  return piexif.insert(bytes, data);
};
