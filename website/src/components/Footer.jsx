const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Strava Stats Redesign. Inspired by the
        original work of <a
      href="https://github.com/JuanPabloDiaz"
      class="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Juan Diaz
    </a>
      </p>
    </footer>
  );
};

export default Footer;