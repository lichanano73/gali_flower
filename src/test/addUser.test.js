// test/usecases/addUser.test.js

const addUser = require('../src/app/usecases/addUser');

describe('addUser usecase', () => {
  it('Debe agregar una empresa correctamente', async () => {
    const mockRepository = {
      addUser: jest.fn().mockResolvedValue(1)
    };

    const newCompany = {
      cuit: '30-12345678-9',
      razonSocial: 'Empresa Test Unitario',
      fechaAdhesion: '2024-04-20'
    };

    const result = await addUser(mockRepository, newCompany);

    expect(result).toBe(1);
    expect(mockRepository.addUser).toHaveBeenCalledWith(expect.objectContaining(newCompany));


  });
});