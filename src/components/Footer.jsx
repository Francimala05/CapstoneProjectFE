import {
  BsFacebook,
  BsInstagram,
  BsTelephone,
  BsTelephoneMinus,
  BsWatch,
} from "react-icons/bs";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="page-footer blue pt-1 pb-3 mt-5 text-white">
      <div className="row justify-content-center mt-5">
        <div className=" mb-2">
          <BsFacebook className="footer-icon me-2" />
          <BsInstagram className="footer-icon me-2" />
          <p className="mt-3">
            <BsTelephone size={17} className="footer-icon me-2 mb-1" />
            081 801 2828 / 081 975 9774
          </p>
          <p className="mt-2">Via Roma 120-122,Gragnano,80054 (NA)</p>
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
