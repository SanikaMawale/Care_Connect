import './DashboardCards.css';

const DashboardCards = ({ cards }) => {
  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div className="card" key={index}>
          <h4>{card.title}</h4>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
