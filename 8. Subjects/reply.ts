import { ChatSubject } from "./chat.subject";
import { User } from "./user.observer";

const chat = new ChatSubject();

const mario = new User('Mario', 'Rossi');
const maria = new User('Maria', 'Verdi');
const angela = new User('Angela', 'Bruni');
const filippo = new User('Filippo', 'Rossi');
const francesco = new User('Francesco', 'Neri');

chat.register(mario);

mario.sendMessage('Ciao a tutti!', chat);

chat.register(maria);
chat.register(angela);

maria.sendMessage('Buonasera a tutti, come state?', chat);

chat.register(filippo);
chat.register(francesco);

chat.close();

maria.sendMessage('La chat non funziona?', chat);
