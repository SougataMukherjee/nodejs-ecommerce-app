import SEO from '../components/SEO';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." />
      <img className="h-96" src='/images/404-not-found.svg' alt='not-found' loading="lazy" />
    </div>
  );
}

export default NotFound;