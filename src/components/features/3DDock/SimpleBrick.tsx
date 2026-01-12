interface SimpleBrickProps {
    title: string;
    color?: string;
}

const SimpleBrick: React.FC<SimpleBrickProps> = ({ title, color = '#4f8ff7' }) => {
    return (
        <div style={{
            width: '180px',
            height: '100px',
            backgroundColor: color,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',

        }}>
      <span style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          padding: '8px',
          textAlign: 'center',
      }}>
        {title}
      </span>
        </div>
    );
};

export default SimpleBrick;