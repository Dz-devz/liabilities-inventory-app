function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className=" text-white py-4 bg-secondary">
      <div className="text-center">
        <p>&copy; {year} TrackNStock. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
