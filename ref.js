require('dotenv').config();
const axios = require('axios');
const chalk = require('chalk');

const names = [
  'alya', 'budi', 'dimas', 'fitri', 'gilang', 'hani', 'indra', 'joko', 'kiki',
  'linda', 'mega', 'niko', 'opik', 'putri', 'reza', 'santi', 'toni', 'ucup',
  'vina', 'wawan', 'xena', 'yani', 'zaki'
];

const generateRandomEmail = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const number = Math.floor(Math.random() * 10000);
  return ${name}${number}@gmail.com;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendReferral = async (email) => {
  try {
    const response = await axios.post(
      'https://api.opendesci.org/v1/referrals/',
      { emails: [email] },
      {
        headers: {
          Authorization: Bearer ${process.env.BEARER_TOKEN},
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200  response.status === 201) {
      console.log(chalk.green(`✅ ${email} | code: ${response.status}`));
    } else {
      console.log(chalk.red(`❌ ${email} | code: ${response.status}`));
    }
  } catch (error) {
    const msg = error.response?.data  error.message;
    const code = error.response?.status  'ERR';
    console.log(chalk.red(`❌ ${email} | code: ${code} | ${JSON.stringify(msg)}`));
  }
};

const main = async () => {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]);

  if (!process.env.BEARER_TOKEN) {
    console.error(chalk.red('❌ BEARER_TOKEN tidak ditemukan di .env'));
    process.exit(1);
  }

  if (isNaN(count)  count < 1) {
    console.error(chalk.yellow('Usage: node auto_referral.js <jumlah_email>'));
    process.exit(1);
  }

  for (let i = 0; i < count; i++) {
    const email = generateRandomEmail();
    await sendReferral(email);

    if ((i + 1) % 10 === 0 && i + 1 < count) {
      console.log(chalk.yellow(⏳ Delay 60 detik setelah ${i + 1} referral...));
      await delay(60000); // 1 menit
    }
  }
};

main();
