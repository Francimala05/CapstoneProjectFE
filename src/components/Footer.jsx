import { GeoAlt } from "react-bootstrap-icons";
import { BsFacebook, BsInstagram, BsTelephone, BsWatch } from "react-icons/bs";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="page-footer blue pt-1 pb-3 mt-5 text-white">
      <div className="row justify-content-center mt-5">
        <div className=" mb-2">
          <a
            style={{ textDecoration: "none" }}
            href="https://www.facebook.com/share/1QwXXgYp1A/?mibextid=wwXIfr"
            className="text-white"
          >
            {" "}
            <BsFacebook className="footer-icon me-2" />
          </a>
          <a
            style={{ textDecoration: "none" }}
            href="https://www.instagram.com/pizzapazzadimalafronteleandro?igsh=MTEwaHQ2ODFmdGM0dw=="
            className="text-white"
          >
            <BsInstagram className="footer-icon me-2" />
          </a>
          <p className="mt-3">
            <BsTelephone size={17} className="footer-icon me-2 mb-1" />
            <a
              style={{ textDecoration: "none" }}
              href="tel:+390818012828"
              className="text-white"
            >
              {" "}
              081 801 2828 /
            </a>
            <a />
            <a
              style={{ textDecoration: "none" }}
              href="tel:+390819759774"
              className="text-white"
            >
              {" "}
              081 975 9774{" "}
            </a>
          </p>
          <p className="mt-2">
            <a
              style={{ textDecoration: "none" }}
              href="https://maps.app.goo.gl/vzkzoswJDMDy3wjC9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <GeoAlt size={17} className="footer-icon mb-1" /> Via Roma
              120-122,Gragnano,80054 (NA)
            </a>
          </p>
          <p className="mt-2">
            <BsWatch size={17} className="footer-icon  mb-1" />{" "}
            <strong>Orari di Apertura:</strong>
            <br />
            Lunedì: 16:00 - 0:00
            <br />
            <i>Martedì giornata di chiusura</i>
            <br />
            Mercoledì: 16:00 - 0:00
            <br />
            Giovedì: 16:00 - 0:00
            <br />
            Venerdì: 16:00 - 0:00
            <br />
            Sabato: 15:30 - 1:00
            <br />
            Domenica: 16:00 - 0:00
          </p>
        </div>
        <div className="mb-2 mt-2 copyright">
          © {currentYear} Pizza Pazza di Malafronte Leandro <br />
          Designed by Francesco Malafronte
        </div>
      </div>
    </footer>
  );
};

export default Footer;
