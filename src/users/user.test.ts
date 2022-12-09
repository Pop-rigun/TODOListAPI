// import { UserService } from '../../src/users/user.service'
// import { User } from '../../src/users/user.entity'
// import AppDataSource from '../../src/ormconfig';
// import { isJSDocUnknownTag } from 'typescript';
// import fastify from 'fastify';
// import  server, { DSddrop } from '../../src/index'
// import { DSclose } from '../../src/index';
// import { createUser } from './utils'


// describe('User functions test', () => {
//     beforeEach(async () => {
//         await server.ready()
//     });
  

//     afterAll(async() => {

//     })
//   it('Register new user', async () => {
//     const response = await server.inject({
//         method: 'POST',
//         url: '/user/register',
//         payload: {
//             name:'1',
//             password:'2',
//           },
        
//     })
    
//     expect(response.statusCode).toEqual(200)
//   })
//   it('Login user', async () => {
//     await createUser()
//     const response = await server.inject({
//         method: 'POST',
//         url: '/user/login',
//         payload: {
//             name:'1',
//             password:'2',
//           },
        
//     })
    
//     expect(response.statusCode).toEqual(200)
//   })
// })