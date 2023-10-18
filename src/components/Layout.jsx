import PropTypes from 'prop-types';
import Header from './Header';

Layout.propTypes = {
  children: PropTypes.array,
};

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <main>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
