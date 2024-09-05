
export const AllAds = () => {
    const people = [
        { name: 'John Doe', email: 'john@examplegha;sjaghoa.com', phone: '123-456-7890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012' },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '456-789-0123' },
        { name: 'Carol White', email: 'carol@example.com', phone: '567-890-1234' },
        { name: 'David Green', email: 'david@example.com', phone: '678-901-2345' },
        { name: 'Eve Black', email: 'eve@example.com', phone: '789-012-3456' },
        { name: 'Frank Blue', email: 'frank@example.com', phone: '890-123-4567' },
        { name: 'Grace Red', email: 'grace@example.com', phone: '901-234-5678' },
        { name: 'Hank Orange', email: 'hank@example.com', phone: '012-345-6789' },
        { name: 'Ivy Purple', email: 'ivy@example.com', phone: '123-456-7891' },{ name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012' },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '456-789-0123' },
        { name: 'Carol White', email: 'carol@example.com', phone: '567-890-1234' },
        { name: 'David Green', email: 'david@example.com', phone: '678-901-2345' },
        { name: 'Eve Black', email: 'eve@example.com', phone: '789-012-3456' },
        { name: 'Frank Blue', email: 'frank@example.com', phone: '890-123-4567' },
        { name: 'Grace Red', email: 'grace@example.com', phone: '901-234-5678' },
        { name: 'Hank Orange', email: 'hank@example.com', phone: '012-345-6789' },
        { name: 'Ivy Purple', email: 'ivy@example.com', phone: '123-456-7891' },{ name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012' },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '456-789-0123' },
        { name: 'Carol White', email: 'carol@example.com', phone: '567-890-1234' },
        { name: 'David Green', email: 'david@example.com', phone: '678-901-2345' },
        { name: 'Eve Black', email: 'eve@example.com', phone: '789-012-3456' },
        { name: 'Frank Blue', email: 'frank@example.com', phone: '890-123-4567' },
        { name: 'Grace Red', email: 'grace@example.com', phone: '901-234-5678' },
        { name: 'Hank Orange', email: 'hank@example.com', phone: '012-345-6789' },
        { name: 'Ivy Purple', email: 'ivy@example.com', phone: '123-456-7891' },{ name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012' },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '456-789-0123' },
        { name: 'Carol White', email: 'carol@example.com', phone: '567-890-1234' },
        { name: 'David Green', email: 'david@example.com', phone: '678-901-2345' },
        { name: 'Eve Black', email: 'eve@example.com', phone: '789-012-3456' },
        { name: 'Frank Blue', email: 'frank@example.com', phone: '890-123-4567' },
        { name: 'Grace Red', email: 'grace@example.com', phone: '901-234-5678' },
        { name: 'Hank Orange', email: 'hank@example.com', phone: '012-345-6789' },
        { name: 'Ivy Purple', email: 'ivy@example.com', phone: '123-456-7891' },{ name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901' },
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012' },
        { name: 'Bob Brown', email: 'bob@example.com', phone: '456-789-0123' },
        { name: 'Carol White', email: 'carol@example.com', phone: '567-890-1234' },
        { name: 'David Green', email: 'david@example.com', phone: '678-901-2345' },
        { name: 'Eve Black', email: 'eve@example.com', phone: '789-012-3456' },
        { name: 'Frank Blue', email: 'frank@example.com', phone: '890-123-4567' },
        { name: 'Grace Red', email: 'grace@example.com', phone: '901-234-5678' },
        { name: 'Hank Orange', email: 'hank@example.com', phone: '012-345-6789' },
        { name: 'Ivy Purple', email: 'ivy@example.com', phone: '123-456-7891' },
      ];
      
    return (
        <div className="p-4 grid grid-cols-4 gap-4">
            {people.map((person, index) => (
                <div 
                    key={index} 
                    className="bg-gray-100 p-6 min-h-[250px] rounded shadow   w-auto mx-auto"
                >
                    <p><strong>Name:</strong> {person.name}</p>
                    <p><strong>Email:</strong> {person.email}</p>
                    <p><strong>Phone:</strong> {person.phone}</p>
                </div>
            ))}
        </div>
    );
};
