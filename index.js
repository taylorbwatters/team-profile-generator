const inquirer = require('inquirer');
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const generateHtml = require('./util/generateHtml');

const fs = require('fs');

const managerQuestions = [
   { 
      name: 'title',
      message: 'who is your team manager?',
      type: 'input',    
   },
   {
       name: 'id',
       message: 'enter employee ID',
       type: 'input',
   },
   {
       name:'email',
       message: 'enter email address',
       type:'input',
   },
   {
       name:'office',
       message:'enter office number',
       type:'input',
   },
];

const engineerQuestions = [
   {
       name:'engineer',
       message:'enter engineer name',
       type:'input',
   },
   {
       name:'en_id',
       message:'enter engineer ID',
       type:'input',
   },
   {
       name:'en_email',
       message:'enter engineer email',
       type: 'input',
   },
   {
       name:'en_git',
       message:'enter engineer github',
       type:'input',
   },
];

const internQuestions = [
   {
       name:'intern',
       message:'enter intern name ',
       type:'input',
   },
   {
       name:'in_id',
       message:'enter intern ID',
       type:'input',
   },
   {
       name:'in_email',
       message:'enter intern ID',
       type:'input',
   },
   {
       name:'in_school',
       message:'enter intern school',
       type:'input',
   },
   
];

inquirer.createPromptModule();

async function askToAddTeamMember() {
    const result = await inquirer.prompt([{
       name:'members',
       message:'would you like to add another member to your team?',
       type:'list',
       choices: ['engineer','intern', 'no'],
   }]);

    switch (result.members) {
        case 'engineer':
            return await askEngineerQuestions();
        case 'intern':
            return await askInternQuestions();
        default:
            return null;
    }
}

async function askManagerQuestions() {
    const result = await inquirer.prompt(managerQuestions);

    return new Manager(result.title, result.id, result.email, result.office);
}

async function askEngineerQuestions() {
    const result = await inquirer.prompt(engineerQuestions);
  
    return new Engineer(result.engineer, result.en_id, result.en_email, result.en_git);
}

async function askInternQuestions() {
    const result = await inquirer.prompt(internQuestions);
    
    return new Intern(result.intern, result.in_id, result.in_email, result.in_school);
}

function writeFileToDist(fileName, data) {
    fs.writeFile('dist/' + fileName + '.html', data, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

async function main() {
    const team = [];
    
    const managerResult = await askManagerQuestions();
    team.push(managerResult);
    
    let wantsToAddNewUser = true; 

    while (wantsToAddNewUser) {
        const newTeamMember = await askToAddTeamMember();
        
        if (newTeamMember === null) {
            wantsToAddNewUser = false;
        } else {
            team.push(newTeamMember);
        }
    }

    const html = generateHtml(team);
    writeFileToDist('index', html);
}

main();
