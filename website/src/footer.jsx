const Footer = () => (
  <footer class="w-full px-4 py-6 border-t text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between">
    <span>© {new Date().getFullYear()} · Under construction</span>
    <a
      href="https://github.com/JuanPabloDiaz"
      class="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Juan Diaz
    </a>
  </footer>
);

export default Footer;
