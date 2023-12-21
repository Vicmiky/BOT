const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/views/index.html');
});
app.listen(3000, () => console.log(`FUNCIONAMIENTO CORRECTO`));

//----------------------------- SISTEMA 24/7 -----------------------------//

const Discord = require("discord.js");
const client = new Discord.Client();
client.setMaxListeners(20); // Establece el límite máximo de listeners en 20

client.on("ready", () => {
   console.log(`INICIADO COMO BOT: ${client.user.tag}`); 
});

//---------------------------- CODIGO DEL BOT ----------------------------//
const prefix = '!';

// Carga los datos de dinero y objetos desde los archivos JSON
let moneyData = {};
let inventoryData = {};
let shopData = {};

try {
  moneyData = require('./money.json');
} catch (error) {
  console.error("Error al cargar el archivo money.json. Se creará uno nuevo.");
  fs.writeFileSync('./money.json', JSON.stringify(moneyData));
}

try {
  inventoryData = require('./inventory.json');
} catch (error) {
  console.error("Error al cargar el archivo inventory.json. Se creará uno nuevo.");
  fs.writeFileSync('./inventory.json', JSON.stringify(inventoryData));
}

try {
  shopData = require('./shop.json');
} catch (error) {
  console.error("Error al cargar el archivo shop.json. Se creará uno nuevo.");
  fs.writeFileSync('./shop.json', JSON.stringify(shopData));
}

//----------------------------- AYUDA -----------------------------//

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ayuda') {
    const embedAyudaInicial = new Discord.MessageEmbed()
      .setTitle('¿En qué necesitas ayuda?')
      .setDescription('1. Cómo unirse\n2. Ayuda comandos')
      .setColor('#FF0000');

    const embedUnirse = new Discord.MessageEmbed()
      .setTitle('¿Cómo me uno?')
      .setDescription('¡Escribe aquí tu consulta sobre cómo unirte!')
      .setColor('#00FF00');

    const embedComandos = new Discord.MessageEmbed()
      .setTitle('Ayuda Comandos')
      .setDescription('Elige una sección:')
      .addFields(
        { name: '1. Dinero', value: 'Información sobre dinero' },
        { name: '2. Atracos', value: 'Ayuda acerca de atracos' },
        { name: '3. Drogas', value: 'Preguntas sobre drogas' },
        { name: '4. Tienda', value: 'Ayuda con la tienda' },
        { name: '5. Multas', value: 'Información sobre multas' },
        { name: '6. DNI', value: 'Ayuda con el DNI' }
      )
      .setColor('#0000FF');

    const embedDinero = new Discord.MessageEmbed()
      .setTitle('Dinero')
      .setDescription('¡Escribe aquí tu consulta sobre dinero!')
      .setColor('#FFFF00');

    const embedAtracos = new Discord.MessageEmbed()
      .setTitle('Atracos')
      .setDescription('¡Escribe aquí tu consulta sobre atracos!')
      .setColor('#FF00FF');

    // ... Aquí se crearían los demás embeds para cada sección

    const msg = await message.channel.send(embedAyudaInicial);
    await msg.react('1️⃣');
    await msg.react('2️⃣');

    const filter = (reaction, user) => {
      return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = msg.createReactionCollector(filter, { time: 60000 });

    collector.on('collect', async (reaction, user) => {
      const chosen = reaction.emoji.name;

      if (chosen === '1️⃣') {
        await msg.edit(embedUnirse);
        await msg.react('↩️');
      } else if (chosen === '2️⃣') {
        await msg.edit(embedComandos);
        await msg.react('↩️');
      }

      const subCollector = msg.createReactionCollector((subReaction, subUser) => {
        return ['↩️'].includes(subReaction.emoji.name) && subUser.id === message.author.id;
      }, { time: 60000 });

      subCollector.on('collect', async (subReaction, subUser) => {
        await msg.edit(embedAyudaInicial);
        await subCollector.stop();
      });

      subCollector.on('end', async () => {
        await msg.reactions.removeAll();
      });
    });

    collector.on('end', async () => {
      await msg.reactions.removeAll();
    });
  }
});

//----------------------------- RESPUESTAS -----------------------------//
client.on('message', async (message) => {
  if (message.author.bot) return; // Ignore messages from bots
  
  if (message.content === 'Hola') {
    message.channel.send('¡Hola! 👋');
  }

//----------------------------- FORMULARIO -----------------------------//


const FORMULARIO_ROLE_ID = '1137345316719427674';
const CANAL_APROBACION_ID_P = '1128022254932983891';
const ROL_APROBADO_ID_P = '1149456116128948265';


const CANAL_APROBACION_ID = '1128022250872909844';
const ROL_APROBADO_ID = '1142543961475530864';

  if (message.content.startsWith('!formulario aprobar') || message.content.startsWith('!formulario a')) {
    if (message.member.roles.cache.has(FORMULARIO_ROLE_ID)) {
      const mentionedUser = message.mentions.members.first();
      if (!mentionedUser) return message.reply('Debes mencionar a un usuario.');

      mentionedUser.roles.add(ROL_APROBADO_ID).catch(console.error);

      message.channel.send(`${mentionedUser}, ¡Tu solicitud ha sido aprobada!`).catch(console.error);
      message.delete().catch(console.error);
    } else {
      message.reply('No tienes permiso para usar este comando.');
    }
  }
  
  if (message.content.startsWith('!e-policia aprobar') || message.content.startsWith('!e-policia a')) {
    if (message.member.roles.cache.has(FORMULARIO_ROLE_ID)) {
      const mentionedUser = message.mentions.members.first();
      if (!mentionedUser) return message.reply('Debes mencionar a un usuario.');

      mentionedUser.roles.add(ROL_APROBADO_ID_P).catch(console.error);

      message.channel.send(`${mentionedUser}, ¡ENHORABUENA! Has aprobado el examen.`).catch(console.error);
      message.delete().catch(console.error);
    } else {
      message.reply('No tienes permiso para usar este comando.');
    }
  }

    if (message.content.startsWith('!e-policia denegar') || message.content.startsWith('!e-policia d')) {
    if (message.member.roles.cache.has(FORMULARIO_ROLE_ID)) {
      const mentionedUser = message.mentions.members.first();
      if (!mentionedUser) return message.reply('Debes mencionar a un usuario.');

      message.channel.send(`${mentionedUser}, has suspendido el examen. ¡Suerte la próxima vez!`).catch(console.error);
      message.delete().catch(console.error);
    } else {
      message.reply('No tienes permiso para usar este comando.');
    }
  }
  
  if (message.content.startsWith('!formulario denegar') || message.content.startsWith('!formulario d')) {
    if (message.member.roles.cache.has(FORMULARIO_ROLE_ID)) {
      const mentionedUser = message.mentions.members.first();
      if (!mentionedUser) return message.reply('Debes mencionar a un usuario.');

      message.channel.send(`${mentionedUser}, Tu solicitud ha sido denegada. ¡Suerte la próxima vez!`).catch(console.error);
      message.delete().catch(console.error);
    } else {
      message.reply('No tienes permiso para usar este comando.');
    }
  }
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
  const serverId = '1127907492370862131'; // ID del servidor
  const rolesToRemove = ['1142543961475530864', '1149456116128948265', '1149456163809804359']; // Roles a eliminar
  const rolesToAdd = ['1128357685146943660', '1128357687072129105']; // Roles a agregar

  // Verificar si el usuario está en el servidor
  const server = newMember.guild;
  if (!server || server.id !== serverId) {
    return;
  }

  // Verificar si el usuario tenía los roles a eliminar y no tiene los roles de destino
  const rolesToRemoveIds = rolesToRemove.map((roleId) => server.roles.cache.get(roleId)).filter(Boolean);
  const rolesToAddIds = rolesToAdd.map((roleId) => server.roles.cache.get(roleId)).filter(Boolean);

  const member = newMember;
  const hasRolesToRemove = rolesToRemoveIds.every((role) => member.roles.cache.has(role.id));
  const hasRolesToAdd = rolesToAddIds.every((role) => member.roles.cache.has(role.id));

  if (hasRolesToRemove && !hasRolesToAdd) {
    member.roles.remove(rolesToRemoveIds).catch(console.error);
    console.log(`Roles actualizados para ${member.user.tag}`);
  }
  });

//----------------------------- SUGERENCIAS -----------------------------//

  client.on("message", async (message) => {
  if (message.channel.id === "1127946422755528734" && !message.author.bot) {
    const suggestionEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setAuthor(message.author.username, message.author.avatarURL())
      .setDescription(message.content)
      .setThumbnail(message.author.avatarURL())
      .setFooter("Reacciona con ✅ o ❌ para votar.");

    try {
      const suggestionMessage = await message.channel.send(suggestionEmbed);
      await suggestionMessage.react("✅");
      await suggestionMessage.react("❌");
      await message.delete();
    } catch (error) {
      console.error("Error al crear la sugerencia:", error);
    }
  }
});

//----------------------------- SEGURIDAD -----------------------------//
// Carga el estado del bot desde el archivo security.json
let botSecurityConfig = {
  botExpulsionEnabled: false
};

if (fs.existsSync('./security.json')) {
  const configFile = fs.readFileSync('./security.json', 'utf8');
  botSecurityConfig = JSON.parse(configFile);
}

client.on("guildMemberAdd", (member) => {
  if (botSecurityConfig.botExpulsionEnabled && member.user.bot) {
    member.kick()
      .then(() => console.log(`Se ha expulsado al bot ${member.user.tag} que se unió al servidor.`))
      .catch(error => console.error(`Error al intentar expulsar al bot: ${error}`));
  }
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "bot") {
    if (!message.member.roles.cache.has('702903069003743253')) {
      return message.reply("solo los usuarios con el rol adecuado pueden usar este comando.");
    }

    if (args[0] === "off") {
      botSecurityConfig.botExpulsionEnabled = false;
      saveConfig();
      message.reply("ahora los bots pueden entrar al servidor.");
    } else if (args[0] === "on") {
      botSecurityConfig.botExpulsionEnabled = true;
      saveConfig();
      message.reply("a partir de ahora, los nuevos bots serán expulsados automáticamente.");
    }
  }
});

// Función para guardar la configuración en el archivo security.json
function saveConfig() {
  fs.writeFileSync('./security.json', JSON.stringify(botSecurityConfig, null, 2));
}
// ----------------------------- DINERO -----------------------------//

// Verificar si el usuario tiene un registro en el archivo "money.json"
function verifyUserMoneyData(userId) {
  if (!moneyData[userId]) {
    moneyData[userId] = {
      money: 5000,
      bank: 0,
      black_money: 0
    };
    fs.writeFileSync('./money.json', JSON.stringify(moneyData));
  }
}

// Función para enviar un registro al canal
function sendLog(embed) {
  const logChannelId = '1137796584105590834'; // ID del canal de registro
  const logChannel = client.channels.cache.get(logChannelId);

  if (logChannel) {
    logChannel.send(embed);
  } else {
    console.error('No se encontró el canal de registro. Asegúrate de que el bot tenga acceso al canal especificado.');
  }
}

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

// Comando: .depositar / .ingresar / .dep / .deposit
if (command === "depositar" || command === "ingresar" || command === "dep" || command === "deposit") {
  let amount = args[0].toLowerCase() === "all" || args[0].toLowerCase() === "todo" ? "all" : parseInt(args[0]);

  if (amount !== "all" && (!amount || amount <= 0)) {
    return message.reply("debes ingresar una cantidad válida.");
  }

  const userId = message.author.id;
  const userMoneyData = moneyData[userId];
  const userMoney = userMoneyData ? userMoneyData.money : 0;
  const userBank = userMoneyData ? userMoneyData.bank : 0;

  if (amount === "all") {
    if (userMoney <= 0) {
      return message.reply("no tienes dinero en mano para depositar en el banco.");
    }

    amount = userMoney;
  } else {
    if (userMoney < amount) {
      return message.reply("no tienes suficiente dinero en mano para depositar esa cantidad en el banco.");
    }
  }

  moneyData[userId] = {
    money: userMoney - amount,
    bank: userBank + amount
  };

  fs.writeFileSync('./money.json', JSON.stringify(moneyData));

  message.reply(`has depositado ${amount}€ en el banco.`);
}

// Comando /dinero
 if (command === "dinero" || command === "bal" || command === "balance") {
    let userId;
    let targetUser;
    let targetUserAvatar;

    const mention = message.mentions.users.first();

    if (mention) {
      userId = mention.id;
      targetUser = mention.username;
      targetUserAvatar = mention.avatarURL();
    } else {
      userId = message.author.id;
      targetUser = message.author.username;
      targetUserAvatar = message.author.avatarURL();
    }

    const userMoneyData = moneyData[userId] || { money: 0, bank: 0, black_money: 0 };
    const userMoney = userMoneyData.money || 0;
    const userBank = userMoneyData.bank || 0;
    const userBlackMoney = userMoneyData.black_money || 0;

    const formattedMoney = userMoney.toLocaleString();
    const formattedBank = userBank.toLocaleString();
    const formattedBlackMoney = userBlackMoney.toLocaleString();

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Dinero de " + targetUser)
      .setThumbnail(targetUserAvatar)
      .setDescription("♦DESTROYER RP♦ | PS4-PS5")
      .addField("Dinero en mano:", formattedMoney + "€")
      .addField("Dinero en el banco:", formattedBank + "€")
      .addField("Dinero negro:", formattedBlackMoney + "€");

    message.channel.send(embed);
  } else if (command === "set-dinero") {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden usar este comando.");
    }

    const username = args[0];
    const amount = parseInt(args[1]);
    const type = args[2];

    if (!username || !type) {
      return message.reply("debes proporcionar el nombre de usuario y el tipo (bank/money).");
    }

    const userId = message.mentions.members.first().id;
    const userData = moneyData[userId];

    if (!userData) {
      return message.reply("no se encontró el usuario especificado.");
    }

    if (type.toLowerCase() === "bank") {
      userData.bank = amount || 0;
    } else if (type.toLowerCase() === "money") {
      userData.money = amount || 0;
    } else {
      return message.reply("el tipo especificado no es válido. Debe ser 'bank' o 'money'.");
    }

    fs.writeFileSync('./money.json', JSON.stringify(moneyData));

    message.reply(`se ha establecido la cantidad de ${amount} ${type} para el usuario ${username}.`);
  } else if (command === "pagar") {
  const senderId = message.author.id;
  const recipientMention = message.mentions.members.first();
  const amount = parseInt(args[1]);

  if (!recipientMention || isNaN(amount)) {
    return message.reply("debes mencionar al usuario y proporcionar una cantidad válida.");
  }

  const recipientId = recipientMention.id;
  const senderData = moneyData[senderId];
  const recipientData = moneyData[recipientId];

  if (!senderData || !recipientData) {
    return message.reply("no se encontró el usuario especificado.");
  }

  if (senderData.money < amount) {
    return message.reply("no tienes suficiente dinero para dar esa cantidad.");
  }

  senderData.money -= amount;
  recipientData.money += amount;

  fs.writeFileSync('./money.json', JSON.stringify(moneyData));

  message.reply(`Has pagado ${amount}€ a ${recipientMention.user.username}.`);

  } else if (command === "añadir-dinero" || command === "añadir-dinero-negro") {
    if (!message.member.roles.cache.has('1135677395240763574') && !message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden usar este comando.");
    }

    const mentionedUser = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!mentionedUser) {
      return message.reply("debes mencionar a un usuario válido.");
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply("debes ingresar una cantidad válida.");
    }

    const userId = mentionedUser.id;
    verifyUserMoneyData(userId);

    if (command === "añadir-dinero-negro") {
      if (!moneyData[userId].black_money) {
        moneyData[userId].black_money = 0;
      }
      moneyData[userId].black_money += amount;
      message.reply(`has añadido ${amount}€ de dinero negro al usuario ${mentionedUser.username}.`);

      // Registro con Embed para dinero negro
      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Registro de dinero negro añadido")
        .setDescription(`Se han añadido ${amount}€ de dinero negro al usuario ${mentionedUser.username}.`)
        .setTimestamp();
      
      sendLog(embed);

    } else {
      moneyData[userId].money += amount;
      message.reply(`has añadido ${amount}€ al usuario ${mentionedUser.username}.`);

      // Registro con Embed para dinero
      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Registro de dinero añadido")
        .setDescription(`${message.author} ha añadido ${amount}€ al usuario ${mentionedUser}.`)
        .setTimestamp();
      
      sendLog(embed);
    }

    fs.writeFileSync("./money.json", JSON.stringify(moneyData));
    
  } else if (command === "sacar") {
  let amount = args[0].toLowerCase() === "all" || args[0].toLowerCase() === "todo" ? "all" : parseInt(args[0]);

  if (amount !== "all" && (!amount || amount <= 0)) {
    return message.reply("debes ingresar una cantidad válida.");
  }

  const userId = message.author.id;
  const userMoney = moneyData[userId] ? moneyData[userId].money : 0;
  const userBank = moneyData[userId] ? moneyData[userId].bank : 0;

  if (amount === "all") {
    if (userBank <= 0) {
      return message.reply("no tienes dinero en el banco para sacar.");
    }

    amount = userBank;
  } else {
    if (userBank < amount) {
      return message.reply("no tienes suficiente dinero en el banco para sacar esa cantidad.");
    }
  }

  moneyData[userId] = {
    money: userMoney + amount,
    bank: userBank - amount
  };

  fs.writeFileSync('./money.json', JSON.stringify(moneyData));

  message.reply(`has sacado ${amount}€ del banco.`);
}
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Comando !wipe-dinero
  if (command === "wipe-dinero") {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden usar este comando.");
    }

    const confirmationEmbed = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle("Confirmación de borrado de dinero")
      .setDescription("¿Estás seguro de que deseas borrar todo el dinero de los usuarios del servidor? Esta acción no se puede deshacer.")
      .addField("Instrucciones", "Para confirmar, reacciona con ✅. Para cancelar, reacciona con ❌.");

    const confirmationMessage = await message.channel.send(confirmationEmbed);
    await confirmationMessage.react("✅");
    await confirmationMessage.react("❌");

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    confirmationMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
          // Borrar todo el dinero de los usuarios
          for (const userId in moneyData) {
            moneyData[userId] = {
              money: 5000,
              bank: 0,
              black_money: 0
            };
          }

          fs.writeFileSync('./money.json', JSON.stringify(moneyData));

          const successEmbed = new Discord.MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Borrado de dinero exitoso")
            .setDescription("Se ha borrado todo el dinero de los usuarios del servidor y se ha reiniciado su cuenta bancaria.");
          
          message.channel.send(successEmbed);
        } else {
          const cancelEmbed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Borrado de dinero cancelado")
            .setDescription("La acción ha sido cancelada. No se ha realizado ningún cambio.");
          
          message.channel.send(cancelEmbed);
        }
      })
      .catch(() => {
        const timeoutEmbed = new Discord.MessageEmbed()
          .setColor("#FF0000")
          .setTitle("Tiempo de espera agotado")
          .setDescription("No se ha recibido una respuesta. La acción ha sido cancelada.");
        
        message.channel.send(timeoutEmbed);
      });
    
    // Borrar el mensaje del comando después de enviar la confirmación
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }
});

//----------------------------- SANCIONES -----------------------------//

// Carga las sanciones desde el archivo .json
let sanciones = {};
try {
  const data = fs.readFileSync('sanciones.json');
  sanciones = JSON.parse(data);
} catch (error) {
  console.error('Error al leer el archivo de sanciones:', error);
}

// Evento que se ejecuta cuando un mensaje es enviado en el servidor
client.on('message', (message) => {
  // Verifica si el mensaje inicia con el prefijo y si el autor no es un bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Divide el mensaje en un array separado por espacios
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  // Toma el primer elemento del array como el nombre del comando y lo convierte a minúsculas
  const command = args.shift().toLowerCase();

  // Comando: .sancionar
  if (command === 'sancionar') {
    // Verifica si el autor del mensaje tiene permisos de administrador
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.send('No tienes permisos para utilizar este comando.');
      return;
    }

    // Obtiene la mencion del usuario y el motivo de la sanción
    const user = message.mentions.users.first();
    const motivo = args.slice(1).join(' ');

    // Verifica si se mencionó a un usuario y se proporcionó un motivo
    if (!user || !motivo) {
      message.channel.send('Debes mencionar a un usuario y proporcionar un motivo de sanción.');
      return;
    }

    // Agrega la sanción al usuario
    if (!sanciones[user.id]) {
      sanciones[user.id] = [];
    }
    sanciones[user.id].push(motivo);

    // Verifica si el usuario ha alcanzado 3 sanciones
    if (sanciones[user.id].length === 3) {
      // Envía un mensaje directo al usuario baneado
      user.send(`Has sido baneado del servidor por el siguiente motivo: ${motivo}. Este ban es indefinido.`)
        .then(() => {
          // Realiza el ban al usuario después de enviar el mensaje directo
          const guild = message.guild;
          const banReason = `${motivo} (Ban indefinido)`;

          guild.members.ban(user, { reason: banReason })
            .then(() => {
              // Elimina todas las sanciones del usuario
              delete sanciones[user.id];

              // Guarda las sanciones actualizadas en el archivo .json
              fs.writeFile('sanciones.json', JSON.stringify(sanciones), (error) => {
                if (error) {
                  console.error('Error al guardar las sanciones:', error);
                }
              });
            })
            .catch((error) => {
              console.error('Error al intentar banear al usuario:', error);
            });
        })
        .catch((error) => {
          console.error('Error al enviar el mensaje directo al usuario:', error);
        });
    } else {
      // Guarda las sanciones en el archivo .json
      fs.writeFile('sanciones.json', JSON.stringify(sanciones), (error) => {
        if (error) {
          console.error('Error al guardar las sanciones:', error);
        }
      });

      // Añade el rol correspondiente al usuario
      const guild = message.guild;
      const sancionRole = guild.roles.cache.get('1120090267870056519');
      const segundoRole = guild.roles.cache.get('1120090380269006858');
      const member = guild.members.cache.get(user.id);
      const sancionesCount = sanciones[user.id].length;

      if (sancionesCount === 1) {
        member.roles.add(sancionRole);
      } else if (sancionesCount === 2) {
        member.roles.remove(sancionRole);
        member.roles.add(segundoRole);
      }

      message.channel.send(`El usuario ${user.tag} ha sido sancionado por el siguiente motivo: ${motivo}`);

    // Enviar mensaje al canal de registro de sanciones
const registroChannel = client.channels.cache.get('1136748630385102968');
if (registroChannel) {
  const sancionesEmbed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle(`Sanción aplicada a ${user.username}`)
    .setDescription(`Motivo: ${motivo}`)
    .addField('Cantidad de sanciones', sancionesCount);

  registroChannel.send(sancionesEmbed);
}
    }
  }

  // Comando: .sanciones
  if (command === 'sanciones') {
    // Obtiene la mencion del usuario
    const user = message.mentions.users.first() || message.author;

    // Verifica si el usuario tiene sanciones
    if (sanciones[user.id] && sanciones[user.id].length > 0) {
      const sancionesEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle(`Sanciones de ${user.tag}`)
        .setDescription('');

      // Agrega las sanciones y sus motivos al embed
      sanciones[user.id].forEach((motivo, index) => {
        sancionesEmbed.setDescription(sancionesEmbed.description + `${index + 1}. ${motivo}\n`);
      });

      message.channel.send(sancionesEmbed);
    } else {
      message.channel.send(`El usuario ${user.tag} no tiene sanciones.`);
    }
  }

  // Comando: .quitar-sanciones
  if (command === 'quitar-sancion') {
    // Verifica si el autor del mensaje tiene permisos de administrador
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.send('No tienes permisos para utilizar este comando.');
      return;
    }

    // Obtiene la mencion del usuario y el ID de la sanción
    const user = message.mentions.users.first();
    const sancionId = parseInt(args[1]);

    // Verifica si se mencionó a un usuario y se proporcionó un ID de sanción válido
    if (!user || isNaN(sancionId) || sancionId <= 0 || !sanciones[user.id] || sancionId > sanciones[user.id].length) {
      message.channel.send('Debes mencionar a un usuario válido y proporcionar un ID de sanción válido.');
      return;
    }

    // Elimina la sanción del usuario
    sanciones[user.id].splice(sancionId - 1, 1);

    // Guarda las sanciones actualizadas en el archivo .json
    fs.writeFile('sanciones.json', JSON.stringify(sanciones), (error) => {
      if (error) {
        console.error('Error al guardar las sanciones:', error);
      }
    });

    message.channel.send(`Se ha eliminado la sanción ${sancionId} del usuario ${user.tag}.`);
  }
});

//----------------------------- TRABAJOS DISPONIBLES -----------------------------//

const rolesList = [
  "1126137782587359312",
  "1135668797399904347",
  "1130187814496108635",
  "1113213524144033872",
  "1113206828952735874",
  "1135681791739564102",
];

let availableUsers = [];
let hideUsers = false;

// Función para actualizar el mensaje embed con la lista de roles y usuarios disponibles
function updateEmbed(message) {
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Personas trabajando");

  rolesList.forEach((roleId) => {
    const role = message.guild.roles.cache.get(roleId);
    if (role) {
      const roleUsers = message.guild.members.cache.filter((member) => member.roles.cache.has(roleId));
      const userList = roleUsers
        .map((member) => {
          const userMention = `<@${member.user.id}>`;
          return availableUsers.includes(member.user.id) ? userMention : "";
        })
        .join("\n");

      const roleName = role.name;
      const userCount = roleUsers.filter((member) => availableUsers.includes(member.user.id)).size;

      if (userList.length > 0) {
        embed.addField(`➤ ${roleName} (${userCount} usuarios)`, userList);
      }
    }
  });

  embed.setDescription(`Usuarios disponibles: ${availableUsers.length}`);
  message.channel.send(embed);
}

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "disponible") {
    updateEmbed(message);
  }

  if (command === "trabajar") {
    // Verificar si el autor tiene alguno de los roles permitidos
    const hasAllowedRole = rolesList.some(roleId => message.member.roles.cache.has(roleId));

    if (!hasAllowedRole) {
      return message.reply("no tienes el rol necesario para utilizar este comando.");
    }

    const userId = message.author.id;
    const index = availableUsers.indexOf(userId);

    if (index === -1) {
      availableUsers.push(userId);
      message.reply("te has añadido a la lista de disponibles para trabajar.");

      // Eliminar al usuario de la lista después de una hora
      setTimeout(() => {
        const indexToRemove = availableUsers.indexOf(userId);
        if (indexToRemove !== -1) {
          availableUsers.splice(indexToRemove, 1);
        }
      }, 3600000); // 3600000 milisegundos = 1 hora
    } else {
      availableUsers.splice(index, 1);
      message.reply("te has quitado de la lista de disponibles para trabajar.");
    }

    updateEmbed(message);
  }
});

//----------------------------- TIENDA -----------------------------//

// Comando para crear un objeto de la tienda
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "crear-objeto")) {
    const questions = [
      '¿Cuál quieres que sea el nombre del item?',
      '¿Cuál será el precio?',
      '¿Quieres que tenga descripción? (si o no)',
      '¿Cuál será la descripción?',
      '¿Quieres que solo lo pueda comprar un rol? (si o no)',
      '¿Qué rol?',
      '¿Quieres que para un rol sea un precio diferente? (si o no)',
      '¿Qué rol?',
      '¿Qué precio tendrá?',
      '¿Se puede usar el objeto? (si o no)',
      '¿Se necesita un objeto en el inventario para poder comprar este objeto? (si o no)',
      '¿Qué objeto se necesita en el inventario? (escribe "ninguno" si no se necesita)',
      '¿Quieres que el objeto de un rol al comprarlo? (si o no)',
      '¿Qué rol?',
      '¿Quieres que al poner !usar el objeto tenga un mensaje personalizado?',
      '¿Qué mensaje?',
      '¿Quieres que se pueda dar el objeto a otra persona? (si o no)',
    ];

    let currentQuestion = 0;
    let itemName = "";
    let itemPrice = 0;
    let hasDescription = false;
    let itemDescription = "";
    let isRoleLimited = false;
    let limitedRole = "";
    let hasRolePrice = false;
    let rolePriceRole = "";
    let rolePrice = 0;
    let isUsable = false;
    let needsInventoryItem = false;
    let inventoryItem = "";
    let roleOnPurchase = false;
    let purchaseRole = "";
    let hasCustomMessage = false;
    let customMessage = "";
    let isGiftable = false; // Nueva variable para determinar si se puede dar
    let giftableRole = ""; // Nueva variable para especificar qué rol puede dar el objeto

    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    const collector = message.channel.createMessageCollector(filter, { max: questions.length, time: 600000 });

    collector.on("collect", (response) => {
      if (currentQuestion === 0) {
        itemName = response.content;
      } else if (currentQuestion === 1) {
        itemPrice = parseInt(response.content);
        if (!itemPrice || itemPrice <= 0) {
          message.reply("debes ingresar un precio válido.");
          collector.stop();
        }
      } else if (currentQuestion === 2) {
        if (response.content.toLowerCase() === "si") {
          hasDescription = true;
        }
      } else if (currentQuestion === 3) {
        if (hasDescription) {
          itemDescription = response.content;
        }
      } else if (currentQuestion === 4) {
        if (response.content.toLowerCase() === "si") {
          isRoleLimited = true;
        }
      } else if (currentQuestion === 5) {
        if (isRoleLimited) {
          limitedRole = response.content;
        }
      } else if (currentQuestion === 6) {
        if (response.content.toLowerCase() === "si") {
          hasRolePrice = true;
        }
      } else if (currentQuestion === 7) {
        if (hasRolePrice) {
          rolePriceRole = response.content;
        }
      } else if (currentQuestion === 8) {
        if (hasRolePrice) {
          rolePrice = parseInt(response.content);
          if (!rolePrice || rolePrice <= 0) {
            message.reply("debes ingresar un precio válido.");
            collector.stop();
          }
        }
      } else if (currentQuestion === 9) {
        if (response.content.toLowerCase() === "si") {
          isUsable = true;
        }
      } else if (currentQuestion === 10) {
        if (response.content.toLowerCase() === "si") {
          needsInventoryItem = true;
        }
      } else if (currentQuestion === 11) {
        if (needsInventoryItem) {
          if (response.content.toLowerCase() !== "ninguno") {
            inventoryItem = response.content;
          }
        }
      } else if (currentQuestion === 12) {
        if (response.content.toLowerCase() === "si") {
          roleOnPurchase = true;
        }
      } else if (currentQuestion === 13) {
        if (roleOnPurchase) {
          purchaseRole = response.content;
        }
      } else if (currentQuestion === 14) {
        if (response.content.toLowerCase() === "si") {
          hasCustomMessage = true;
        }
      } else if (currentQuestion === 15) {
        if (hasCustomMessage) {
          customMessage = response.content;
        }
      } else if (currentQuestion === 16) {
        if (response.content.toLowerCase() === "si") {
          isGiftable = true;
        }
      } else if (currentQuestion === 17) {
        if (isGiftable) {
          giftableRole = response.content;
        }
      }

      currentQuestion++;
      if (currentQuestion < questions.length) {
        message.channel.send(questions[currentQuestion]);
      } else {
        const itemId = Math.random().toString(36).substring(2, 10);
        shopData[itemId] = {
          name: itemName,
          price: itemPrice,
          description: itemDescription,
          roleLimited: isRoleLimited,
          limitedRole: limitedRole,
          hasRolePrice: hasRolePrice,
          rolePriceRole: rolePriceRole,
          rolePrice: rolePrice,
          isUsable: isUsable,
          needsInventoryItem: needsInventoryItem,
          inventoryItem: inventoryItem,
          roleOnPurchase: roleOnPurchase,
          purchaseRole: purchaseRole,
          hasCustomMessage: hasCustomMessage,
          customMessage: customMessage,
          isGiftable: isGiftable, // Nueva propiedad
          giftableRole: giftableRole, // Nueva propiedad
        };

        fs.writeFileSync('./shop.json', JSON.stringify(shopData));

        message.reply(`el objeto ${itemName} se ha creado en la tienda.`);
        collector.stop();
      }
    });

    message.channel.send(questions[currentQuestion]);
  }

// Comando para ver todos los objetos de la tienda
const itemsPerPage = 3;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "tienda")) {
    const userId = message.author.id;
    const userInventory = inventoryData[userId];

    const visibleItems = Object.keys(shopData).filter((itemId) => {
      const item = shopData[itemId];
      if (item.needsInventoryItem && (!userInventory || !userInventory[item.inventoryItem] || userInventory[item.inventoryItem] <= 0)) {
        return false; // Ocultar este objeto, ya que no se puede comprar
      }
      return true;
    });

    const totalItems = visibleItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let page = 1;
    let startIndex = 0;

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Tienda de: ♦DESTROYER RP♦ | PS4-PS5")
      .setDescription("¡Bienvenido a la tienda! Aquí tienes una lista de los objetos disponibles para comprar:")
      .setThumbnail("https://cdn.discordapp.com/attachments/1116807534267875449/1131948539262546001/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png");

    function formatPrice(price) {
      return price.toLocaleString();
    }

    function generateShopEmbed() {
      embed.fields = [];

      for (let i = startIndex; i < Math.min(startIndex + itemsPerPage, totalItems); i++) {
        const itemId = visibleItems[i];
        const item = shopData[itemId];

        let description = item.description ? item.description : "No hay descripción disponible";
        if (item.roleLimited) {
          description += `\n**Requiere el rol:** ${item.limitedRole}`;
        }
        if (item.hasRolePrice) {
          description += `\n**Precio para el rol ${item.rolePriceRole}:** ${formatPrice(item.rolePrice)}€`;
        }

        const emoticon = "<a:flecha:1117523511200722975>";
        const itemNameWithEmoticon = `${emoticon} **${item.name}**`;
        embed.addField(itemNameWithEmoticon, `**Precio:** ${formatPrice(item.price)}€\n${description}`);
      }

      embed.setFooter(`Página ${page}/${totalPages}`);
      return embed;
    }

    message.channel.send(generateShopEmbed()).then((shopMessage) => {
      if (totalPages > 1) {
        shopMessage.react("◀️");
        shopMessage.react("▶️");

        const filter = (reaction, user) => {
          return ["◀️", "▶️"].includes(reaction.emoji.name) && !user.bot && user.id === message.author.id;
        };

        const collector = shopMessage.createReactionCollector(filter, { time: 60000 });

        collector.on("collect", (reaction) => {
          reaction.users.remove(message.author.id).catch(console.error);

          if (reaction.emoji.name === "◀️" && page > 1) {
            page--;
            startIndex = (page - 1) * itemsPerPage;
            shopMessage.edit(generateShopEmbed());
          } else if (reaction.emoji.name === "▶️" && page < totalPages) {
            page++;
            startIndex = (page - 1) * itemsPerPage;
            shopMessage.edit(generateShopEmbed());
          }
        });

        collector.on("end", () => {
          shopMessage.reactions.removeAll().catch(console.error);
        });
      }
    });
  }

// Comando para comprar un objeto de la tienda
if (!message.content.startsWith(prefix) || message.author.bot) return;

if (message.content.startsWith(prefix + "comprar")) {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const itemName = args.slice(1).join(" ");

  const userId = message.author.id;
  const userMoney = moneyData[userId] ? moneyData[userId].money : 0;

  const item = Object.values(shopData).find((item) => item.name.toLowerCase() === itemName.toLowerCase());

  if (!item) {
    return message.reply("no se encontró el objeto en la tienda.");
  }

  if (userMoney < item.price) {
    return message.reply("no tienes suficiente dinero para comprar este objeto.");
  }

  if (item.roleLimited) {
    const requiredRole = message.guild.roles.cache.get(item.limitedRole);

    if (!requiredRole) {
      console.error("El rol requerido para comprar este objeto no existe en el servidor.");
      return message.reply("el rol requerido para comprar este objeto no existe en el servidor.");
    }

    if (!message.member.roles.cache.has(requiredRole.id)) {
      return message.reply("no tienes el rol necesario para comprar este objeto.");
    }
  }

  if (item.onlyPurchaseWhenNoOneIsWorking) {
    const workRole = message.guild.roles.cache.get(item.workRole);

    if (!workRole) {
      console.error("El rol de trabajo especificado en el objeto no existe en el servidor.");
      return message.reply("el rol de trabajo especificado en el objeto no existe en el servidor.");
    }

    const usersWorking = message.guild.members.cache.filter((member) => member.roles.cache.has(workRole.id));

    if (usersWorking.size > 0) {
      return message.reply("no se puede comprar este objeto mientras haya alguien trabajando.");
    }
  }

  if (item.hasRolePrice && message.member.roles.cache.some((role) => role.id === item.rolePriceRole)) {
    if (moneyData[userId].money < item.rolePrice) {
      return message.reply("no tienes suficiente dinero para comprar este objeto con el precio de tu rol.");
    }

    moneyData[userId].money -= item.rolePrice;
  } else {
    moneyData[userId].money -= item.price;
  }

  if (!inventoryData[userId]) {
    inventoryData[userId] = {};
  }

  if (!inventoryData[userId][item.name]) {
    inventoryData[userId][item.name] = 0;
  }

  inventoryData[userId][item.name]++;

  // Agregar el rol al usuario al comprar el objeto
  if (item.roleOnPurchase) {
    const purchaseRole = message.guild.roles.cache.get(item.purchaseRole);
    if (purchaseRole) {
      message.member.roles.add(purchaseRole).then(() => {
        fs.writeFileSync('./money.json', JSON.stringify(moneyData));
        fs.writeFileSync('./inventory.json', JSON.stringify(inventoryData));
        message.reply(`has comprado ${item.name} por ${item.price}€ y se te ha asignado el rol ${purchaseRole.name}.`);
      }).catch((error) => {
        console.error('Error al agregar el rol:', error);
        message.reply('Ocurrió un error al agregar el rol.');
      });
    } else {
      console.error('El rol especificado en el objeto no existe en el servidor.');
      message.reply('Ocurrió un error al agregar el rol.');
    }
  } else {
    fs.writeFileSync('./money.json', JSON.stringify(moneyData));
    fs.writeFileSync('./inventory.json', JSON.stringify(inventoryData));
    message.reply(`has comprado ${item.name} por ${item.price}€.`);
  }
}
  
// Comando para borrar un objeto de la tienda
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "borrar-tienda")) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const itemName = args.slice(1).join(" ");

    const item = Object.values(shopData).find((item) => item.name.toLowerCase() === itemName.toLowerCase());

    if (!item) {
      return message.reply("no se encontró el objeto en la tienda.");
    }

    const itemId = Object.keys(shopData).find((key) => shopData[key] === item);
    delete shopData[itemId];
    fs.writeFileSync('./shop.json', JSON.stringify(shopData));

    message.reply(`el objeto ${itemName} se ha eliminado de la tienda.`);
  }


// Comando para ver el inventario

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "inventario") || message.content.startsWith(prefix + "inv")) {
    let userId;
    let targetUser;
    
    const mention = message.mentions.users.first();
    
    if (mention) {
      userId = mention.id;
      targetUser = mention.username;
    } else {
      userId = message.author.id;
      targetUser = message.author.username;
    }
    
    const userInventory = inventoryData[userId];

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Inventario de " + targetUser);

    if (userInventory) {
      for (const itemName in userInventory) {
        const quantity = userInventory[itemName];
        embed.addField(itemName, `Cantidad: ${quantity}`);
      }
    } else {
      embed.setDescription("El inventario está vacío.");
    }

    message.channel.send(embed);
  }
});

// Comando para tirar un objeto del inventario
client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'tirar') {
    let itemName = args.join(' ');
    let quantity = 1;

    // Verificar si se proporciona una cantidad junto al nombre del objeto
    if (itemName.includes(' ')) {
      const parts = itemName.split(' ');
      itemName = parts.slice(0, parts.length - 1).join(' ');
      quantity = parseInt(parts[parts.length - 1]);

      // Verificar si la cantidad proporcionada es un número válido y mayor que cero
      if (isNaN(quantity) || quantity <= 0) {
        return message.reply('Debes proporcionar una cantidad válida.');
      }
    } else {
      // Si no se proporciona un número, eliminar solo una unidad
      itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    }

    const userId = message.author.id;
    const userInventory = inventoryData[userId];

    // Verificar si el usuario tiene el objeto en el inventario, ignorando mayúsculas y minúsculas
    const itemFound = Object.keys(userInventory || {}).find(key => key.toLowerCase() === itemName.toLowerCase());
    if (!userInventory || !itemFound || userInventory[itemFound] <= 0) {
      return message.reply('No tienes ese objeto en tu inventario.');
    }

    // Verificar si la cantidad que quiere tirar es mayor a la que tiene en el inventario
    if (quantity > userInventory[itemFound]) {
      return message.reply(`No tienes ${quantity} ${itemName} en tu inventario. Tienes ${userInventory[itemFound]}.`);
    }

    userInventory[itemFound] -= quantity;
    if (userInventory[itemFound] === 0) {
      delete userInventory[itemFound];
    }

    fs.writeFile(inventoryFile, JSON.stringify(inventoryData, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el inventario:', err);
        return message.reply('Ocurrió un error al guardar el inventario.');
      }

      message.reply(`Has tirado ${quantity} ${itemName} del inventario.`);
    });
  }
});


// Comando para usar un objeto del inventario

const inventoryFile = 'inventory.json';

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

 if (command === 'usar') {
    const itemName = args.join(' ');

    const userId = message.author.id;
    const userInventory = inventoryData[userId];

    // Verificar si el usuario tiene el objeto en el inventario, ignorando mayúsculas y minúsculas
    const itemFound = Object.keys(userInventory || {}).find(
      (key) => key.toLowerCase() === itemName.toLowerCase()
    );
    if (!userInventory || !itemFound || userInventory[itemFound] <= 0) {
      return message.reply('No tienes ese objeto en tu inventario.');
    }

    // Obtener el objeto de la tienda que coincide con el nombre del objeto usado
    const shopItem = Object.values(shopData).find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (shopItem && shopItem.isUsable) {
      // Si el objeto requiere otro objeto en el inventario para poder usarse
      if (shopItem.needsInventoryItem) {
        if (!userInventory[shopItem.inventoryItem] || userInventory[shopItem.inventoryItem] <= 0) {
          return message.reply(
            `Para usar este objeto, necesitas tener el objeto "${shopItem.inventoryItem}" en tu inventario.`
          );
        }
      }

      // Aplicar el mensaje personalizado, si está configurado
      if (shopItem.hasCustomMessage) {
        return message.reply(shopItem.customMessage);
      }

      // Otorgar el rol al usuario, si está configurado
      if (shopItem.roleOnPurchase) {
        const role = message.guild.roles.cache.find((r) => r.name === shopItem.purchaseRole);
        if (role) {
          message.member.roles.add(role).catch(console.error);
        }
      }
    } else {
      return message.reply('No puedes usar este objeto.');
    }

    userInventory[itemFound]--;
    if (userInventory[itemFound] === 0) {
      delete userInventory[itemFound];
    }

    fs.writeFile(inventoryFile, JSON.stringify(inventoryData, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el inventario:', err);
        return message.reply('Ocurrió un error al guardar el inventario.');
      }
    });

    message.reply(`Has usado un objeto de ${itemFound}.`);
  }

  // Comando para dar un objeto del inventario a otro usuario

  if (command === 'dar-objeto') {
    const mention = message.mentions.members.first();
    const itemName = args.slice(1).join(' ');

    if (!mention || !itemName) {
      return message.reply('Debes mencionar a un usuario y proporcionar el nombre del objeto.');
    }

    const userId = message.author.id;
    const recipientId = mention.user.id;
    const userInventory = inventoryData[userId];
    let recipientInventory = inventoryData[recipientId];

    const capitalizedItemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    if (!userInventory || !userInventory[capitalizedItemName] || userInventory[capitalizedItemName] <= 0) {
      return message.reply('No tienes ese objeto en tu inventario.');
    }

    userInventory[capitalizedItemName]--;
    if (userInventory[capitalizedItemName] === 0) {
      delete userInventory[capitalizedItemName];
    }

    if (!recipientInventory) {
      recipientInventory = {};
      inventoryData[recipientId] = recipientInventory;
    }

    if (!recipientInventory[capitalizedItemName]) {
      recipientInventory[capitalizedItemName] = 0;
    }

    recipientInventory[capitalizedItemName]++;

    fs.writeFile(inventoryFile, JSON.stringify(inventoryData, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el inventario:', err);
        return message.reply('Ocurrió un error al guardar el inventario.');
      }

      message.reply(`Has dado 1 ${capitalizedItemName} a ${mention}.`);
    });
  }
});

//----------------------------- CRIMENES -----------------------------//




//----------------------------- DISPONIBLE -----------------------------//



//----------------------------- BASURERO -----------------------------//

const grupos = [
  {
    nombre: 'Grupo1',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120779452448784394/Grand_Theft_Auto_V_20230620192607.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120779453287637153/Grand_Theft_Auto_V_20230616210221.jpg'
    ]
  },
  {
    nombre: 'Grupo2',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120779894243217428/Grand_Theft_Auto_V_20230620171959.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120779894540992512/Grand_Theft_Auto_V_20230620171846.jpg'
    ]
  },
  {
    nombre: 'Grupo3',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780058387304509/Grand_Theft_Auto_V_20230620174350.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780058685091850/Grand_Theft_Auto_V_20230620174157.jpg'
    ]
  },
  {
    nombre: 'Grupo4',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780149395308605/Grand_Theft_Auto_V_20230620172802.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780149760200734/Grand_Theft_Auto_V_20230620172503.jpg'
    ]
  },
  {
    nombre: 'Grupo5',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780204449742958/Grand_Theft_Auto_V_20230620192327.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780204764307576/Grand_Theft_Auto_V_20230620173136.jpg'
    ]
  },
  {
    nombre: 'Grupo6',
    imagenes: [
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780251807625386/Grand_Theft_Auto_V_20230620174922.jpg',
      'https://cdn.discordapp.com/attachments/826118113426407447/1120780252155760762/Grand_Theft_Auto_V_20230620174746.jpg'
    ]
  }
];

const acciones = [
  'Que te den',
  'Cuernos',
  'Saludo',
  'Me la pela',
  'Lanzar beso',
  'Hasta el fondo',
  'Acoplar',
  'Nudillos',
  'Aplauso',
  'Vergüenza ajena',
  'Cojonudo',
  '¡Tachán!',
  'Hurgar nariz',
  'Guitarra aérea',
  'Saludar con la mano',
  'Rendición',
  'Chitón',
  'Fotografía',
  'DJ',
  'Teclado aéreo',
  'Ni hablar',
  'Gallina',
  'Paso de todo',
  'Delicioso',
  'Paz'
];

let lastGrupoIndex = -1;
let lastAccionIndex = -1;

client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'basurero') {
    // Verificar si el usuario tiene el rol permitido para utilizar el comando
    const allowedRoleId = '1117819565347442688'; // Reemplazar con la ID del rol permitido

    if (!message.member.roles.cache.has(allowedRoleId)) {
      message.reply('No tienes permiso para utilizar este comando.');
      return;
    }

    let grupoIndex = Math.floor(Math.random() * grupos.length);
    while (grupoIndex === lastGrupoIndex) {
      grupoIndex = Math.floor(Math.random() * grupos.length);
    }
    lastGrupoIndex = grupoIndex;

    const grupoSeleccionado = grupos[grupoIndex];

    message.channel.send(`**${grupoSeleccionado.nombre}:**`);

    for (const imagen of grupoSeleccionado.imagenes) {
      message.channel.send(imagen);
    }

    let accionIndex = Math.floor(Math.random() * acciones.length);
    while (accionIndex === lastAccionIndex) {
      accionIndex = Math.floor(Math.random() * acciones.length);
    }
    lastAccionIndex = accionIndex;

    const accionSeleccionada = acciones[accionIndex];
    message.channel.send(
      `Esta es la ubicación a la que tienes que ir para recibir el pago. Para verificar que lo has completado, haz una foto en la que aparezca tu personaje en la ubicación haciendo la siguiente acción: **${accionSeleccionada}**`
    );
  }
});

//----------------------------- MULTAS -----------------------------//

let multasData = {}; // Aquí almacenaremos los datos de las multas
if (fs.existsSync('./multas.json')) {
  multasData = JSON.parse(fs.readFileSync('./multas.json', 'utf8'));
}

// Función para enviar un registro al canal de registro
function sendLogToChannel(embed) {
  const logChannelId = '1139194834456944651'; // Cambia esto al ID del canal de registro
  const logChannel = client.channels.cache.get(logChannelId);

  if (logChannel) {
    logChannel.send(embed);
  } else {
    console.error('No se encontró el canal de registro. Asegúrate de que el bot tenga acceso al canal especificado.');
  }
}

// Función para sumar la cantidad a la multa cada 24 horas
function increaseMultaAmount() {
  for (const multaId in multasData) {
    const multa = multasData[multaId];
    if (!multa.paid) {
      multa.amount += multa.amountInicial;
      fs.writeFileSync('./multas.json', JSON.stringify(multasData));
    }
  }
}

// Función para eliminar multas pagadas después de 2 días
function deletePaidMultas() {
  for (const multaId in multasData) {
    const multa = multasData[multaId];
    if (multa.paid && Date.now() - multa.timestamp >= 2 * 24 * 60 * 60 * 1000) {
      delete multasData[multaId];
      fs.writeFileSync('./multas.json', JSON.stringify(multasData));
    }
  }
}

setInterval(increaseMultaAmount, 24 * 60 * 60 * 1000); // Ejecuta cada 24 horas
setInterval(deletePaidMultas, 60 * 60 * 1000); // Ejecuta cada hora


client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

// Comando !multar
if (command === "multar") {
  if (!message.member.roles.cache.has('1126137782587359312')) {
    return message.reply("Solo los policias pueden usar este comando.");
  }

  const mentionedUser = message.mentions.members.first();
  const amountInicial = parseInt(args[1]);
  const motivo = args.slice(2).join(" ");

  if (!mentionedUser || isNaN(amountInicial) || !motivo) {
    return message.reply("debes mencionar a un usuario, proporcionar una cantidad válida y un motivo.");
  }

  const multaId = Object.keys(multasData).length + 1;
  multasData[multaId] = {
    userId: mentionedUser.id,
    amount: amountInicial,
    amountInicial: amountInicial,
    motivo: motivo,
    paid: false,
    timestamp: Date.now() // Guarda la marca de tiempo
  };

  fs.writeFileSync('./multas.json', JSON.stringify(multasData));

  const embed = new Discord.MessageEmbed()
    .setColor("#FF0000")
    .setTitle("Multa registrada")
    .addField("Usuario multado:", mentionedUser.user.username)
    .addField("Cantidad:", `${amountInicial}€`)
    .addField("Motivo:", motivo);

  sendLogToChannel(embed);
  message.reply(`se ha registrado una multa de ${amountInicial}€ al usuario ${mentionedUser.user.username}.`);
}

// Comando !multas
if (command === "multas") {
  const mentionedUser = message.mentions.members.first() || message.member;
  const multasList = Object.entries(multasData)
    .filter(([_, multa]) => multa.userId === mentionedUser.id)
    .map(([multaId, multa]) => {
      const timestamp = new Date(multa.timestamp);
      timestamp.setTime(timestamp.getTime() + timestamp.getTimezoneOffset() * 60 * 1000 + 2 * 60 * 60 * 1000); // Ajuste para la hora española
      const formattedTimestamp = timestamp.toLocaleString("es-ES", { timeZone: "Europe/Madrid", month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
      return `**${multaId}.** ${multa.amount}€ - ${multa.motivo} - ${multa.paid ? 'Pagada' : 'Pendiente'} ||_${formattedTimestamp}_||`;
    })
    .join("\n");

  if (!multasList) {
    return message.reply("no se encontraron multas para el usuario especificado.");
  }

  const embed = new Discord.MessageEmbed()
    .setColor("#FFA500")
    .setTitle("Multas de " + mentionedUser.user.username)
    .setDescription(multasList);

  message.channel.send(embed);
}


  // Comando !borrar-multas
  if (command === "borrar-multa") {
    if (!message.member.roles.cache.has('1126137782587359312')) {
      return message.reply("solo los administradores pueden usar este comando.");
    }

    const mentionedUser = message.mentions.members.first();
    const multaId = parseInt(args[1]);

    if (!mentionedUser || isNaN(multaId)) {
      return message.reply("debes mencionar a un usuario y proporcionar un ID de multa válido.");
    }

    if (!multasData[multaId] || multasData[multaId].userId !== mentionedUser.id) {
      return message.reply("no se encontró la multa especificada para el usuario.");
    }

    delete multasData[multaId];
    fs.writeFileSync('./multas.json', JSON.stringify(multasData));

    message.reply(`se ha eliminado la multa con ID ${multaId} para el usuario ${mentionedUser.user.username}.`);
  }

const bancoPoliciaFile = './banco-policia.json';
let bancoPolicia = {}; // Variable para almacenar los datos del banco de la policía

// Cargar los datos del banco de la policía desde el archivo JSON
if (fs.existsSync(bancoPoliciaFile)) {
  bancoPolicia = JSON.parse(fs.readFileSync(bancoPoliciaFile, 'utf8'));
}
  
// Comando !pagar-multa
  if (command === "pagar-multa") {
    const multaId = parseInt(args[0]);

    if (isNaN(multaId)) {
      return message.reply("debes proporcionar un ID de multa válido.");
    }

    const multa = multasData[multaId];

    if (!multa) {
      return message.reply("no se encontró la multa especificada.");
    }

    if (multa.paid) {
      return message.reply("esta multa ya ha sido pagada.");
    }

    const userId = message.author.id;
    const userMoneyData = moneyData[userId];

    if (!userMoneyData) {
      return message.reply("no se encontraron datos de dinero para tu usuario.");
    }

    if (userMoneyData.bank < multa.amount) {
      return message.reply("no tienes suficiente dinero en el banco para pagar esta multa.");
    }

    userMoneyData.bank -= multa.amount;
    bancoPolicia.amount += multa.amount; // Suma la cantidad al banco de la policía
    multa.paid = true;
    multa.fechaPago = Date.now(); // Guarda la fecha de pago en el objeto de multa

    fs.writeFileSync('./money.json', JSON.stringify(moneyData));
    fs.writeFileSync('./multas.json', JSON.stringify(multasData));
    fs.writeFileSync(bancoPoliciaFile, JSON.stringify(bancoPolicia)); // Guarda los cambios en el banco de la policía

    const embed = new Discord.MessageEmbed()
      .setColor("#00FF00")
      .setTitle("Multa pagada")
      .addField("Usuario:", message.author.username)
      .addField("Cantidad:", `${multa.amount}€`)
      .addField("Motivo:", multa.motivo);

    sendLogToChannel(embed)
      .catch(error => {
        console.error(`Error al enviar el registro al canal de registro: ${error}`);
      });

    message.reply(`has pagado la multa con ID ${multaId} por un monto de ${multa.amount}€ desde tu banco.`);
  }

// Comando !dinero-policia
if (command === "dinero-policia") {
  if (!message.member.roles.cache.has('1126137782587359312')) {
    return message.reply("solo los policías pueden usar este comando.");
  }

  const embed = new Discord.MessageEmbed()
    .setColor("#0000FF")
    .setTitle("Banco de la Policía")
    .addField("Dinero actual:", `${bancoPolicia.amount}€`);

  message.channel.send(embed);
}

// Comando !sacar-policia
if (command === "sacar-policia") {
  if (!message.member.roles.cache.has('1127904738697027647')) {
    return message.reply("solo los administradores pueden usar este comando.");
  }

  const mentionedUser = message.mentions.members.first();
  const amount = parseInt(args[1]);

  if (!mentionedUser || isNaN(amount)) {
    return message.reply("debes mencionar a un usuario y proporcionar una cantidad válida.");
  }

  if (mentionedUser.roles.cache.has('1126137782587359312')) {
    return message.reply("no puedes dar dinero a un policía.");
  }

  if (amount > bancoPolicia.amount) {
    return message.reply("el banco de la policía no tiene suficiente dinero.");
  }

  // Sumar el dinero al usuario mencionado
  const userId = mentionedUser.id;
  verifyUserMoneyData(userId);
  moneyData[userId].money += amount;
  fs.writeFileSync('./money.json', JSON.stringify(moneyData));

  // Restar el dinero del banco de la policía
  bancoPolicia.amount -= amount;
  fs.writeFileSync(bancoPoliciaFile, JSON.stringify(bancoPolicia));

  message.channel.send(`Se le ha dado ${amount}€ a ${mentionedUser.user.username}.`);
}

// Comando !log-policia
if (command === "log-policia") {
  if (!message.member.roles.cache.has('1126137782587359312')) {
    return message.reply("solo los policías pueden usar este comando.");
  }

  const logs = Object.entries(bancoPolicia.logs)
    .map(([timestamp, amount]) => {
      const formattedTimestamp = new Date(parseInt(timestamp)).toLocaleString("es-ES", { timeZone: "Europe/Madrid", month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
      return `**${formattedTimestamp}:** ${amount}€`;
    })
    .join("\n");

  const embed = new Discord.MessageEmbed()
    .setColor("#0000FF")
    .setTitle("Registro del Banco de la Policía")
    .setDescription(logs || "No hay registros.");

  message.channel.send(embed);
}
});

//----------------------------- ROBOS Y CRIMENES -----------------------------//

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'robar') {
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      return message.reply('Debes mencionar a un usuario para robar.');
    }

    // Crear el embed para que el usuario mencionado confirme el robo
    const confirmEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('¡Te están robando!')
      .setDescription(`${message.author} está intentando robarte todo tu dinero. Rechazalo si es un antirol y no dudes en reportarlo.`)
      .setFooter('Reacciona a este mensaje con ✅ para confirmar o ignora para rechazar el robo.');

    try {
      // Enviar el embed y guardar la referencia al mensaje
      const confirmMessage = await targetUser.send(confirmEmbed);
      // Añadir las reacciones para que el usuario pueda confirmar o rechazar
      await confirmMessage.react('✅'); // Reacción de confirmación (checkmark)

      // Crear un filtro para verificar las reacciones
      const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === targetUser.id;

      // Esperar a que el usuario reaccione durante 30 segundos
      confirmMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(async (collected) => {
          const reaction = collected.first();

          if (reaction && reaction.emoji.name === '✅') {
            // Se ha confirmado el robo, proceder a realizar el robo
            const targetUserId = targetUser.id;
            const senderUserId = message.author.id;
            const targetUserData = moneyData[targetUserId];
            const senderUserData = moneyData[senderUserId];

            if (!targetUserData || !senderUserData) {
              return message.reply('No se encontró la información de uno de los usuarios.');
            }

            if (targetUserData.money < 1) {
              return message.reply(`${targetUser} no tiene dinero para robar.`);
            }

            const stolenAmount = targetUserData.money;
            targetUserData.money = 0;
            senderUserData.money += stolenAmount;

            fs.writeFileSync('./money.json', JSON.stringify(moneyData));

            message.channel.send(`${message.author} ha robado todo el dinero de ${targetUser}.`);
          } else {
            // Se rechazó el robo
            message.channel.send(`${targetUser} ha rechazado el robo de ${message.author}.`);
          }
        })
        .catch((error) => {
          console.error('Error al esperar las reacciones:', error);
          message.channel.send('Se acabó el tiempo para confirmar el robo.');
        });
    } catch (error) {
      console.error('Error al enviar el mensaje de confirmación:', error);
      message.reply('No se pudo enviar el mensaje de confirmación al usuario mencionado.');
    }

    // Borrar el mensaje del comando después de enviar el embed
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }
});

//----------------------------- FUNCIONES -----------------------------//

// Evento cuando un nuevo miembro se une al servidor
client.on("guildMemberAdd", (member) => {
  const userId = member.id;
  
  verifyUserMoneyData(userId);
  
  console.log(`Se ha creado una cuenta bancaria para el usuario ${member.user.username}.`);
});

//----------------------------- COMANDOS ADMINS -----------------------------//
const oposChannelName = "𝙊𝙥𝙤𝙨𝙞𝙘𝙞𝙤𝙣𝙚𝙨-𝘼𝙙𝙢𝙞𝙣";

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "opos") {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden usar este comando.");
    }

    if (args[0] === "on") {
      const category = '1112026016517476454';
      const roleName = '1112019857169457192';

      const overwrites = [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: roleName,
          allow: ['VIEW_CHANNEL'],
        },
      ];

      const channel = await message.guild.channels.create(oposChannelName, {
        type: "text",
        parent: category,
        permissionOverwrites: overwrites,
      });

      channel.send("Para postularte como administrador, es necesario unirte a este servidor de Discord https://discord.gg/UgcTSUUS");

      const announceChannel = message.guild.channels.cache.get('1127931574118252645');
      announceChannel.send(`Las oposiciones para admin están disponibles en el canal ${channel}.\n\n||@everyone||`);

      message.delete();
    } else if (args[0] === "off") {
      const channelToDelete = message.guild.channels.cache.find(channel => channel.name === oposChannelName && channel.parentID === '1112026016517476454');

      if (channelToDelete) {
        await channelToDelete.delete();
      }

      const announceChannel = message.guild.channels.cache.get('1127931574118252645');
      announceChannel.send("Las oposiciones para admin ya no están disponibles no se abrirán hasta próximo aviso.\n\n||@everyone||");

      message.delete();
    }
  }

// Comando .añadir-reaccion
  if (command === 'añadir-reaccion') {
    // Verificar permisos de administrador
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('No tienes permiso para utilizar este comando.');
      return;
    }

    // Verificar que se proporcionen los argumentos necesarios
    if (args.length < 2) {
      message.reply('Debes proporcionar el emoticono de la reacción y el ID del mensaje.');
      return;
    }

    // Obtener el emoticono de la reacción y el ID del mensaje
    const reactionEmoji = args[0];
    const messageID = args[1];

    // Obtener el mensaje a partir del ID
    message.channel.messages.fetch(messageID)
      .then((fetchedMessage) => {
        // Añadir la reacción al mensaje
        fetchedMessage.react(reactionEmoji)
          .then(() => {
            message.reply(`Se ha añadido la reacción ${reactionEmoji} al mensaje con ID ${messageID}.`);
          })
          .catch((error) => {
            console.error('Error al añadir la reacción al mensaje:', error);
            message.reply('Ocurrió un error al añadir la reacción al mensaje.');
          });
      })
      .catch((error) => {
        console.error('Error al obtener el mensaje:', error);
        message.reply('No se pudo encontrar un mensaje con el ID proporcionado.');
      });
  } else if (command === 'rol') {
    if (!message.member.roles.cache.has('1135677395240763574') && !message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden utilizar este comando.");
    }

    const roleMention = message.mentions.roles.first();
    const userMention = message.mentions.members.first();

    if (!roleMention || !userMention) {
      return message.reply("debes mencionar un rol y un usuario.");
    }

    if (roleMention.id === message.guild.roles.everyone.id) {
      message.guild.members.cache.forEach((member) => {
        if (!member.user.bot) {
          member.roles.add(roleMention).catch((error) => {
            console.error(`Error al asignar el rol a ${member.user.tag}:`, error);
          });
        }
      });

      message.reply(`se ha asignado el rol "${roleMention.name}" a todos los usuarios, excepto a los bots.`);
    } else {
      userMention.roles.add(roleMention)
        .then(() => {
          message.reply(`se ha asignado el rol "${roleMention.name}" con éxito a ${userMention.user.username}.`);
        })
        .catch((error) => {
          console.error(error);
          message.reply("ocurrió un error al asignar el rol.");
        });
    }
  } else if (command === 'kick') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('No tienes permiso para utilizar este comando.');
      return;
    }

    const mention = message.mentions.users.first();
    if (!mention) {
      message.reply('Debes mencionar a un usuario para expulsarlo.');
      return;
    }

    const member = message.guild.member(mention);

    if (!member || !member.kickable) {
      message.reply('No se pudo expulsar al usuario mencionado.');
      return;
    }

    member.kick()
      .then(() => {
        message.reply(`El usuario ${mention.tag} ha sido expulsado del servidor.`);
      })
      .catch((error) => {
        console.error('Error al expulsar al usuario:', error);
        message.reply('Ocurrió un error al expulsar al usuario mencionado.');
      });
  } else if (command === 'unrol') {
    if (!message.member.roles.cache.has('1135677395240763574') && !message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply("solo los administradores pueden utilizar este comando.");
    }

    const roleMention = message.mentions.roles.first();
    const userMention = message.mentions.members.first();

    if (!roleMention || !userMention) {
      return message.reply("debes mencionar un rol y un usuario.");
    }

    userMention.roles.remove(roleMention)
      .then(() => {
        message.reply(`se ha quitado el rol con éxito a ${userMention.user.username}.`);
      })
      .catch((error) => {
        console.error(error);
        message.reply("ocurrió un error al quitar el rol.");
      });
  } else if (command === 'say') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('No tienes permiso para utilizar este comando.');
      return;
    }

    const mensaje = args.join(' ');

    message.delete().catch(console.error); // Eliminar el mensaje original del usuario

    message.channel.send(mensaje);
  } else if (command === 'clear') {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.reply('No tienes permiso para utilizar este comando.');
      return;
    }

    const cantidadMensajes = parseInt(args[0]);

    if (isNaN(cantidadMensajes) || cantidadMensajes <= 0) {
      message.reply('Debes proporcionar un número válido de mensajes a borrar.');
      return;
    }

    message.channel.bulkDelete(cantidadMensajes + 1)
      .then((messages) => {
        message.channel.send(`Se han borrado ${messages.size - 1} mensajes.`)
          .then((msg) => {
            msg.delete({ timeout: 5000 }).catch(console.error);
          });
      })
      .catch((error) => {
        console.error('Error al borrar mensajes:', error);
        message.reply('Ocurrió un error al borrar los mensajes.');
      });
  } else if (command === "rol-todos") {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
      return message.reply("No tienes permiso para usar este comando.");
    }

    const role = message.mentions.roles.first();
    if (!role) {
      return message.reply("Debes mencionar un rol.");
    }

    const members = await message.guild.members.fetch();

    members.forEach((member) => {
      if (!member.user.bot && !member.roles.cache.has(role.id)) {
        member.roles.add(role)
          .catch((error) => console.error(`Error al asignar el rol a ${member.user.tag}:`, error));
      }
    });

    message.reply(`Se ha asignado el rol ${role.name} a todos los miembros del servidor que no son bots.`);
  } else if (command === 'unrol-todos') {
    if (!message.member.hasPermission('MANAGE_ROLES')) {
      return message.reply('No tienes permiso para usar este comando.');
    }

    const role = message.mentions.roles.first();
    if (!role) {
      return message.reply('Debes mencionar un rol.');
    }

    const members = await message.guild.members.fetch();

    members.forEach(async (member) => {
      if (!member.user.bot && member.roles.cache.has(role.id)) {
        await member.roles.remove(role).catch((error) => console.error(`Error al quitar el rol de ${member.user.tag}:`, error));
      }
    });

    message.reply(`Se ha quitado el rol ${role.name} a todos los miembros del servidor que no son bots y lo tenían.`);
  }
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "limpiar-apodos") {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
      return message.reply("solo los miembros con permisos de gestionar apodos pueden usar este comando.");
    }

    // Obtener todos los miembros del servidor (excepto bots)
    const members = message.guild.members.cache.filter(member => !member.user.bot);

    // Limpiar los apodos de todos los miembros
    members.forEach(member => {
      member.setNickname(null)
        .catch((error) => {
          console.error(`Error al borrar el apodo de ${member.user.username}:`, error);
        });
    });

    message.reply('Se han borrado todos los apodos del servidor.');
  }
});

//----------------------------- COMANDOS ROL -----------------------------//

// Comando .anon
client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'anon') {
        if (!message.member.roles.cache.has('1151582039942905916')) {
      return message.reply('No tienes permiso para usar este comando.');
  }
    if (!args.length) {
      return message.reply('Debes proporcionar un mensaje para enviar de forma anónima.');
    }

    message.delete().catch((err) => {
      console.error(`Error al borrar el mensaje: ${err}`);
    });

    const embed = new Discord.MessageEmbed()
      .setColor('#142449')
      .setTitle('USUARIO ANÓNIMO')
      .setDescription(args.join(' '))
      .setThumbnail('https://cuv.upc.edu/es/shared/imatges/fotos-professorat-i-professionals/anonimo.jpg/@@images/image.jpeg')
      .setFooter('♦DESTROYER RP♦', 'https://i.ibb.co/q5KNc7M/a.png');

    message.channel.send(embed);

  } else if (command === 'me') {
    const content = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor('#1ECC55')
      .setTitle('•ME•')
      .setDescription(`<a:flecha:1117523511200722975> ${content}`)
      .setFooter(`Realizado por ${message.author.username}`, 'https://cdn.discordapp.com/attachments/826118113426407447/1126155151275733003/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png');

    message.channel.send(embed);
  } else if (command === 'do') {
    const content = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor('#D31616')
      .setTitle('•DO•')
      .setDescription(`<a:flecha:1117523511200722975> ${content}`)
      .setFooter(`Realizado por ${message.author.username}`, 'https://cdn.discordapp.com/attachments/826118113426407447/1126155151275733003/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png');

    message.channel.send(embed);
  } else if (command === 'ent'|| command === "entorno") {
    const content = args.join(' ');

    message.delete().catch((err) => {
      console.error(`Error al borrar el mensaje de ejecución: ${err}`);
    });

    const embed = new Discord.MessageEmbed()
      .setColor('#D31616')
      .setTitle('•ENTORNO•')
      .setDescription(`<a:flecha:1117523511200722975> ${content}`)
      .setThumbnail('https://media.tenor.com/WKWonIB6gjIAAAAC/police-siren-siren.gif')
      .setFooter(`Detectado por las cámaras de la zona`, 'https://cdn.discordapp.com/attachments/826118113426407447/1126155151275733003/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png');

    message.channel.send(embed);

    const suggestionChannel = message.guild.channels.cache.get('1127932208607408149');
    if (suggestionChannel) {
      suggestionChannel.send(embed);
    }
  } else if (command === 'twt' || command === "twitter" || command === "twit" || command === "twitt" || command === "twitte" || command === "tw") {
    const content = args.join(' ');

    const embed = new Discord.MessageEmbed()
      .setColor('#0097ff')
      .setTitle('•TWITTER•')
      .setDescription(`<a:flecha:1117523511200722975> ${content}`)
      .setThumbnail('https://i.ibb.co/9vhRqvv/png-transparent-logo-youtube-twitter-bird-blue-logo-computer-wallpaper-thumbnail-removebg-preview.png')
      .setFooter(`Realizado por ${message.author.username}`, 'https://cdn.discordapp.com/attachments/826118113426407447/1126155151275733003/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png');

    message.channel.send(embed);

    const suggestionChannel = message.guild.channels.cache.get('1112088752253304883');
    if (suggestionChannel) {
      suggestionChannel.send(embed);
    }
  }
});
//----------------------------- DNI -----------------------------//

const dnisFile = 'dnis.json';
const roleId = '1112019857169457192'; // ID del rol a asignar

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "crear-dni" || command === "registrarse") {
    // Verificar que se proporcionen los argumentos necesarios
    const emojiId = '1146561098137477170';
const emoji = message.guild.emojis.cache.get(emojiId);
    if (args.length < 4) {
      return message.reply('Debes proporcionar Nombre, Apellidos, FechaDeNacimiento e IdDePlay.');
    }

    // Obtener los valores de los argumentos
    const nombre = args[0];
    const apellidos = args[1];
    const fechaNacimiento = args[2];
    const idPlay = args[3];

    // Generar un número de DNI aleatorio y una letra en mayúscula aleatoria
    const dniNumero = Math.floor(Math.random() * 100000000);
    const dniLetra = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    
// Asignar el apodo al usuario
    const nickname = `${message.author.username} | ${idPlay}`;
    message.member.setNickname(nickname)
      .then(() => {
        // Enviar el mensaje con el embed
        message.channel.send(dniEmbed);
      })
      .catch((error) => {
        console.error('Error al establecer el apodo del usuario:', error);
        return message.reply('Ocurrió un error al establecer el apodo del usuario.');
      });

// Crear el mensaje en un embed con decoraciones
    const dniEmbed = new Discord.MessageEmbed()
      .setColor("#4B0082")
      .setTitle(`${emoji} DNI DE ${message.author.username} ${emoji}`)
      .setDescription(
        `<a:flecha:1117523511200722975> DNI: ${dniNumero}${dniLetra}\n<a:flecha:1117523511200722975> Nombre: ${nombre}\n<a:flecha:1117523511200722975> Apellidos: ${apellidos}\n<a:flecha:1117523511200722975> Fecha de nacimiento: ${fechaNacimiento}\n<a:flecha:1117523511200722975> Id de Play: ${idPlay}`
      )
      .setThumbnail(message.author.displayAvatarURL())
.setImage("https://cdn.discordapp.com/attachments/717821702180044862/729449197480181810/color_seperater_thingy.gif")
      .setFooter("©DESTROYER RP", "https://cdn.discordapp.com/attachments/1116807534267875449/1134893581392412672/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png");

    // Almacenar la información en un archivo
    fs.readFile(dnisFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo de DNIs:', err);
        return message.reply('Ocurrió un error al buscar los DNIs.');
      }

      let dniData = {};

      try {
        dniData = JSON.parse(data);
      } catch (error) {
        console.error('Error al parsear el archivo de DNIs:', error);
        return message.reply('Ocurrió un error al leer los DNIs.');
      }

      dniData[message.author.id] = {
        dni_number: dniNumero,
        dni_letter: dniLetra,
        nombre: nombre,
        apellidos: apellidos,
        fecha_nacimiento: fechaNacimiento,
        id_play: idPlay,
      };

      fs.writeFile(dnisFile, JSON.stringify(dniData, null, 2), (err) => {
        if (err) {
          console.error('Error al guardar el DNI en el archivo:', err);
          return message.reply('Ocurrió un error al guardar el DNI.');
        }

        // Asignar el rol al usuario
        const role = message.guild.roles.cache.get(roleId);
        if (role) {
          message.member.roles.add(role)
            .then(() => {
              // Enviar el mensaje con el embed
              message.channel.send(dniEmbed);
            })
            .catch((error) => {
              console.error('Error al asignar el rol al usuario:', error);
              return message.reply('Ocurrió un error al asignar el rol.');
            });
        } else {
          console.error('El rol especificado no existe en el servidor.');
          return message.reply('El rol especificado no existe en el servidor.');
        }
      });
    });
  }

  if (command === 'id') {
    // Obtener todos los miembros del servidor (excepto bots)
    const members = message.guild.members.cache.filter(member => !member.user.bot);

    // Leer los DNIs existentes
    fs.readFile(dnisFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo de DNIs:', err);
        return message.reply('Ocurrió un error al buscar los DNIs.');
      }

      let dniData = {};

      try {
        dniData = JSON.parse(data);
      } catch (error) {
        console.error('Error al parsear el archivo de DNIs:', error);
        return message.reply('Ocurrió un error al leer los DNIs.');
      }

      // Recorrer todos los miembros y establecer el apodo si no tienen DNI
      members.forEach(member => {
        const dniInfo = dniData[member.id];
        if (!dniInfo) {
          return; // El miembro no tiene DNI registrado
        }

        const idPlay = dniInfo.id_play;
        const nickname = `${member.user.username} | ${idPlay}`;

        member.setNickname(nickname)
          .catch((error) => {
            console.error(`Error al establecer el apodo de ${member.user.username}:`, error);
          });
      });

      message.reply('Se han aplicado los apodos a los usuarios sin DNI.');
    });
  }

   if (command === 'dni') {
     const emojiId = '1146561098137477170';
const emoji = message.guild.emojis.cache.get(emojiId);
    fs.readFile(dnisFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo de DNIs:', err);
        return message.reply('Ocurrió un error al buscar los DNIs.');
      }

      let dniData = {};

      try {
        dniData = JSON.parse(data);
      } catch (error) {
        console.error('Error al parsear el archivo de DNIs:', error);
        return message.reply('Ocurrió un error al leer los DNIs.');
      }

      // Verificar si se mencionó a un usuario
      const mention = message.mentions.users.first();
      let userData;

      if (mention) {
        userData = dniData[mention.id];
      } else {
        userData = dniData[message.author.id];
      }

      if (!userData) {
        return message.reply('No tienes un DNI guardado.');
      }

      // Crear el mensaje en un embed con decoraciones
      const dniEmbed = new Discord.MessageEmbed()
        .setColor("#4B0082")
        .setTitle(`${emoji} DNI DE ${message.author.username} ${emoji} `)
        .setDescription(
          `<a:flecha:1117523511200722975> DNI: ${userData.dni_number}${userData.dni_letter}\n<a:flecha:1117523511200722975> Nombre: ${userData.nombre}\n<a:flecha:1117523511200722975> Apellidos: ${userData.apellidos}\n<a:flecha:1117523511200722975> Fecha de nacimiento: ${userData.fecha_nacimiento}\n<a:flecha:1117523511200722975> Id de Play: ${userData.id_play}`
        )
        .setThumbnail(message.author.displayAvatarURL())
        .setImage("https://i.ibb.co/BqwNQ0s/color-seperater-thingy.gif")
        .setFooter("©DESTROYER RP", "https://cdn.discordapp.com/attachments/1116807534267875449/1134893581392412672/Captura_de_pantalla_2023-05-28_180301-PhotoRoom-modified.png");

      // Enviar el mensaje con el DNI guardado
      message.channel.send(dniEmbed);
    });
  }
});

//----------------------------- MENU ADMIN -----------------------------//

//----------------------------- INICIO ROL -----------------------------//

// Función para enviar un mensaje de embed
function sendEmbed(channel, color, title, description) {
  const embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);

  channel.send(embed).catch((error) => {
    console.error('Error al enviar el embed:', error);
  });
}

// Comando /rol?
client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'rol?') {
    // Comprobar si el usuario tiene el rol con ID 1135571585785397289
    if (!message.member.roles.cache.has('1135571585785397289')) {
      return message.reply('No tienes permiso para usar este comando.');
    }

    // Borrar 10 mensajes del canal 1140770490126975016
    const roleChannel = message.guild.channels.cache.get('1140770490126975016');
    if (roleChannel && roleChannel.type === 'text') {
      roleChannel.bulkDelete(10).catch((error) => {
        console.error('Error al borrar los mensajes del canal:', error);
      });

      // Enviar el embed de "inactivo" por el canal 1140770490126975016
      sendEmbed(roleChannel, "#FF0000", "Rol inactivo", "El rol actual está inactivo.");

      // Enviar el mensaje "Quien rol? || @everyone ||" al canal 1112058633367334992
      const targetChannel = message.guild.channels.cache.get('1112058633367334992');
      if (targetChannel && targetChannel.type === 'text') {
        targetChannel.send('Quien rol? || @everyone ||');
      }
    }

    // Borrar el mensaje del comando después de enviar los mensajes
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }

// Comando /esperando
  if (command === 'esperando') {
    // Comprobar si el usuario tiene el rol con ID 1135571585785397289
    if (!message.member.roles.cache.has('1135571585785397289')) {
      return message.reply('No tienes permiso para usar este comando.');
    }

    // Enviar el mensaje al canal con ID 1112058633367334992
    const targetChannel = message.guild.channels.cache.get('1112058633367334992');
    if (targetChannel && targetChannel.type === 'text') {
      targetChannel.send('Esperando para iniciar. Uniros mediante la invitacion de la crew. || @everyone ||');
    }

    // Borrar el mensaje del comando después de enviar el mensaje
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }

// Comando /falta
  if (command === 'falta') {
    // Comprobar si el usuario tiene el rol con ID 1135571585785397289
    if (!message.member.roles.cache.has('1135571585785397289')) {
      return message.reply('No tienes permiso para usar este comando.');
    }

    // Enviar el mensaje al canal con ID 1112058633367334992
    const targetChannel = message.guild.channels.cache.get('1112058633367334992');
    if (targetChannel && targetChannel.type === 'text') {
      targetChannel.send('Esperando para iniciar. Quien falta? || @everyone ||');
    }

    // Borrar el mensaje del comando después de enviar el mensaje
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }

// Comando /iniciar
  if (command === 'iniciar') {
    // Comprobar si el usuario tiene el rol con ID 1135571585785397289
    if (!message.member.roles.cache.has('1135571585785397289')) {
      return message.reply('No tienes permiso para usar este comando.');
    }

    // Borrar 10 mensajes del canal 1140770490126975016
    const roleChannel = message.guild.channels.cache.get('1140770490126975016');
    if (roleChannel && roleChannel.type === 'text') {
      roleChannel.bulkDelete(10).catch((error) => {
        console.error('Error al borrar los mensajes del canal:', error);
      });

      // Enviar el mensaje de "inactivo" por el canal 1140770490126975016
      sendEmbed(roleChannel, "#00FF00", "Rol activo", "No podrás unirte hasta el próximo rol.");

      // Enviar el mensaje "Quien rol? || @everyone ||" al canal 1112058633367334992
      const targetChannel = message.guild.channels.cache.get('1112058633367334992');
      if (targetChannel && targetChannel.type === 'text') {
        targetChannel.send('Se inicia rol. Disfruten');
      }

      // Establecer un temporizador para borrar los mensajes y enviar el embed de inactivo después de 1 hora
      setTimeout(() => {
        roleChannel.bulkDelete(10).catch((error) => {
          console.error('Error al borrar los mensajes del canal:', error);
        });
        sendEmbed(roleChannel, "#FF0000", "Rol inactivo", "El rol actual está inactivo.");
      }, 3600000); // 1 hora en milisegundos
    }

    // Borrar el mensaje del comando después de enviar los mensajes
    message.delete().catch((error) => {
      console.error('Error al borrar el mensaje del comando:', error);
    });
  }
});

const votacionChannelId = '1144723511093510206'; // ID del canal de votación
const allowedRoleId = '1135571585785397289'; // ID del rol permitido para usar el comando

client.on('message', async message => {
  if (message.author.bot) return; // Ignorar mensajes de bots

  if (message.content.startsWith('!votar') && message.member.roles.cache.has(allowedRoleId)) {
    // Eliminar el mensaje que ejecuta el comando
    message.delete();

    // Extraer la información de la votación del mensaje
    const votacionInfo = message.content.slice('!votar'.length).trim();

    // Obtener el rol que deseas mencionar
    const rolMencionado = message.guild.roles.cache.get('1112019857169457192'); // Cambia el ID del rol a tu ID correcto

    // Crear un Embed para la votación
    const votacionEmbed = new Discord.MessageEmbed()
      .setColor('#0a4a6d') // Cambiar el color a un tono más oscuro (código hexadecimal)
      .setTitle(`VOTACIÓN PARA ROL!ㅤㅤㅤㅤㅤ`) // Mencionar el rol en el título
      .setDescription(votacionInfo)
      .setThumbnail(message.guild.iconURL()) // Agregar la foto del servidor a la derecha
      .addFields(
        { name: 'Si asistiré', value: '✅\n', inline: false },
        { name: 'No asistiré', value: '❌\n', inline: false },
        { name: 'Asistiré de policía', value: '🚔\n', inline: false },
        { name: 'Me uniré más tarde', value: '⏰\n', inline: false }
      )
      .setFooter(`Enviado por ${message.author.username}`, message.author.displayAvatarURL()) // Mostrar el autor

    // Enviar el Embed al canal de votación
    const votacionChannel = client.channels.cache.get(votacionChannelId);
    if (votacionChannel) {
      const mensajeVotacion = await votacionChannel.send(votacionEmbed);

      // Agregar reacciones a la votación
      await mensajeVotacion.react('✅');
      await mensajeVotacion.react('❌');
      await mensajeVotacion.react('🚔');
      await mensajeVotacion.react('⏰'); // Reacción para "Me uniré más tarde"

      // Crear un collector para controlar las reacciones
      const filter = (reaction, user) => user.id === message.author.id;
      const collector = mensajeVotacion.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', (reaction, user) => {
        // Eliminar otras reacciones del usuario
        mensajeVotacion.reactions.cache.forEach((cachedReaction) => {
          if (cachedReaction.users.cache.has(user.id) && cachedReaction !== reaction) {
            cachedReaction.users.remove(user.id);
          }
        });
      });
    }
  }
});

//----------------------------- MANTENIMIENTO -----------------------------//

//----------------------------- CASINO -----------------------------//

// Emoticonos
const fichasEmote = '🎟️'; // Emoticono de las fichas del casino
const ticketsEmote = '🎫'; // Emoticono de los tickets del usuario
const backButtonEmote = '◀️'; // Emoticono de volver atrás
const buyEmote = '🛒'; // Emoticono de comprar fichas
const exchangeEmote = '🔄'; // Emoticono de canjear fichas
const cancelEmote = '❌'; // Emoticono de cancelar

const ticketsFile = 'tickets.json';
let ticketsData = {};

// Cargar los tickets guardados del archivo .json al iniciar el bot
try {
  const data = fs.readFileSync(ticketsFile, 'utf8');
  ticketsData = JSON.parse(data);
} catch (error) {
  console.error('Error al leer el archivo de tickets:', error);
}

// Función para guardar los tickets en el archivo .json
function saveTickets() {
  fs.writeFileSync(ticketsFile, JSON.stringify(ticketsData, null, 2));
}

client.on('message', (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'casino') {
    const userId = message.author.id;
    let userTickets = ticketsData[userId] || 0;

    const casinoEmbed = new Discord.MessageEmbed()
      .setColor('#FFD700')
      .setTitle('Menú del Casino')
      .setDescription('¡Bienvenido al casino! ¿A dónde quieres ir?')
      .addField('🎰 Juegos del Casino', 'Pulsa esta reacción para ver los juegos del casino.')
      .addField(`${fichasEmote} Fichas del Casino`, 'Pulsa esta reacción para ver tus fichas del casino.')
      .setFooter(`Tienes ${userTickets} tickets en total.`);

    message.channel.send(casinoEmbed)
      .then(embedMessage => {
        embedMessage.react('🎰');
        embedMessage.react(fichasEmote);
        embedMessage.react(backButtonEmote);

        const filter = (reaction, user) => {
          return [backButtonEmote, '🎰', fichasEmote].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const collector = embedMessage.createReactionCollector(filter, { time: 60000 });

        collector.on('collect', async (reaction, user) => {
          reaction.users.remove(user.id).catch(error => console.error('Error al quitar la reacción:', error));

          const chosenOption = reaction.emoji.name;
          if (chosenOption === '🎰') {
            // Mostrar los juegos del casino
            const juegosEmbed = new Discord.MessageEmbed()
              .setColor('#FF4500')
              .setTitle('Juegos del Casino')
              .setDescription('¡Elige un juego para jugar!')
              .addField('1️⃣ Tragaperras', 'Pulsa esta reacción para jugar a las tragaperras.')
              .addField('2️⃣ Ruleta', 'Pulsa esta reacción para jugar a la ruleta.');

            embedMessage.edit(juegosEmbed);
          } else if (chosenOption === fichasEmote) {
            // Mostrar las fichas del casino
            const fichasEmbed = new Discord.MessageEmbed()
              .setColor('#32CD32')
              .setTitle('Fichas del Casino')
              .setDescription(`Tienes ${userTickets} fichas en total.`)
              .addField('🛒 Comprar Fichas', 'Pulsa esta reacción para comprar fichas del casino.')
              .addField('🔄 Canjear Fichas', 'Pulsa esta reacción para canjear tus fichas del casino por dinero.')
              .setFooter(`Reacciona con ${backButtonEmote} para volver atrás.`);

            embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
            embedMessage.edit(fichasEmbed)
              .then(embedMessage => {
                embedMessage.react(buyEmote);
                embedMessage.react(exchangeEmote);
                embedMessage.react(backButtonEmote);
              })
              .then(() => {
                // Escuchar las reacciones en el nuevo embed
                const filter = (reaction, user) => {
                  return [backButtonEmote, buyEmote, exchangeEmote].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = embedMessage.createReactionCollector(filter, { time: 60000 });

                collector.on('collect', async (reaction, user) => {
                  reaction.users.remove(user.id).catch(error => console.error('Error al quitar la reacción:', error));

                  const chosenOption = reaction.emoji.name;
                  if (chosenOption === backButtonEmote) {
                    // Volver atrás al menú principal
                    embedMessage.edit(casinoEmbed);
                    embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                    embedMessage.react('🎰');
                    embedMessage.react(fichasEmote);
                    embedMessage.react(backButtonEmote);
                  } else if (chosenOption === buyEmote) {
                    // Comprar fichas
                    embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                    const filter = (reaction, user) => {
                      return reaction.emoji.name === cancelEmote && user.id === message.author.id;
                    };

                    embedMessage.edit('Escribe la cantidad de fichas que deseas comprar (cada ficha vale 1€).\n\nReacciona con ❌ para cancelar.');
                    embedMessage.react(cancelEmote);

                    const collector = embedMessage.createReactionCollector(filter, { time: 60000 });

                    collector.on('collect', async (reaction, user) => {
                      reaction.users.remove(user.id).catch(error => console.error('Error al quitar la reacción:', error));
                      embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                      embedMessage.react(buyEmote);
                      embedMessage.react(exchangeEmote);
                      embedMessage.react(backButtonEmote);
                      embedMessage.edit(fichasEmbed);
                    });

                    collector.on('end', collected => {
                      embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                    });

                    const msgFilter = (msg) => msg.author.id === user.id;
                    const msgCollector = message.channel.createMessageCollector(msgFilter, { max: 1, time: 60000 });

                    msgCollector.on('collect', (msg) => {
                      const amount = parseInt(msg.content);
                      if (isNaN(amount) || amount <= 0) {
                        msg.reply('debes ingresar una cantidad válida.');
                        return;
                      }

                      // Verificar si el usuario tiene suficiente dinero para comprar las fichas
                      const userMoneyData = moneyData[userId] || { money: 0, bank: 0, black_money: 0 };
                      const userMoney = userMoneyData.money || 0;
                      const userBank = userMoneyData.bank || 0;
                      const totalMoney = userMoney + userBank;

                      if (totalMoney < amount) {
                        msg.reply('no tienes suficiente dinero para comprar esa cantidad de fichas.');
                        return;
                      }

                      // Restar el dinero al usuario y sumar las fichas
                      const newMoney = Math.max(userMoney - amount, 0);
                      const remainingAmount = Math.max(amount - userMoney, 0);
                      const newBank = Math.max(userBank - remainingAmount, 0);

                      moneyData[userId] = {
                        ...userMoneyData,
                        money: newMoney,
                        bank: newBank
                      };

                      ticketsData[userId] = (ticketsData[userId] || 0) + amount;

                      saveTickets();
                      fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));

                      msg.reply(`has comprado ${amount} fichas por ${amount}€.`);
                      embedMessage.edit(fichasEmbed);
                      embedMessage.react(buyEmote);
                      embedMessage.react(exchangeEmote);
                      embedMessage.react(backButtonEmote);
                    });
                  } else if (chosenOption === exchangeEmote) {
                    // Canjear fichas por dinero
                    embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                    const filter = (reaction, user) => {
                      return reaction.emoji.name === cancelEmote && user.id === message.author.id;
                    };

                    embedMessage.edit('Escribe la cantidad de fichas que deseas canjear por dinero (cada ficha vale 1€).\n\nReacciona con ❌ para cancelar.');
                    embedMessage.react(cancelEmote);

                    const collector = embedMessage.createReactionCollector(filter, { time: 60000 });

                    collector.on('collect', async (reaction, user) => {
                      reaction.users.remove(user.id).catch(error => console.error('Error al quitar la reacción:', error));
                      embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                      embedMessage.react(buyEmote);
                      embedMessage.react(exchangeEmote);
                      embedMessage.react(backButtonEmote);
                      embedMessage.edit(fichasEmbed);
                    });

                    collector.on('end', collected => {
                      embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                    });

                    const msgFilter = (msg) => msg.author.id === user.id;
                    const msgCollector = message.channel.createMessageCollector(msgFilter, { max: 1, time: 60000 });

                    msgCollector.on('collect', (msg) => {
                      const amount = parseInt(msg.content);
                      if (isNaN(amount) || amount <= 0) {
                        msg.reply('debes ingresar una cantidad válida.');
                        return;
                      }

                      // Verificar si el usuario tiene suficientes fichas para canjear
                      if (ticketsData[userId] < amount) {
                        msg.reply('no tienes suficientes fichas para canjear esa cantidad.');
                        return;
                      }

                      // Sumar el dinero al usuario y restar las fichas
                      const userMoneyData = moneyData[userId] || { money: 0, bank: 0, black_money: 0 };
                      const userMoney = userMoneyData.money || 0;
                      const userBank = userMoneyData.bank || 0;

                      moneyData[userId] = {
                        ...userMoneyData,
                        money: userMoney + amount
                      };

                      ticketsData[userId] -= amount;

                      saveTickets();
                      fs.writeFileSync('./money.json', JSON.stringify(moneyData, null, 2));

                      msg.reply(`has canjeado ${amount} fichas por ${amount}€.`);
                      embedMessage.edit(fichasEmbed);
                      embedMessage.react(buyEmote);
                      embedMessage.react(exchangeEmote);
                      embedMessage.react(backButtonEmote);
                    });
                  }
                });

                collector.on('end', collected => {
                  embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
                  embedMessage.react(buyEmote);
                  embedMessage.react(exchangeEmote);
                  embedMessage.react(backButtonEmote);
                });
              });
          } else if (chosenOption === backButtonEmote) {
            // Volver atrás al menú principal
            embedMessage.edit(casinoEmbed);
            embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
            embedMessage.react('🎰');
            embedMessage.react(fichasEmote);
            embedMessage.react(backButtonEmote);
          }
        });

        collector.on('end', collected => {
          embedMessage.reactions.removeAll().catch(error => console.error('Error al eliminar reacciones:', error));
        });
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
      });
  } else if (command === 'tickets') {
    const userId = message.author.id;
    const userTickets = ticketsData[userId] || 0;

    message.channel.send(`Tienes ${userTickets} tickets.`);
  }
});

//----------------------------- CONEXION AL BOT -----------------------------//

const mySecret = process.env['TOKEN']
client.login(process.env.TOKEN);