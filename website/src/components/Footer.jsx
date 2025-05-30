const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Strava Stats Redesign. Inspired by the
        original work of Juan Pablo Diaz.
      </p>
    </footer>
  );
};

export default Footer;
