import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from './services/contacts.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/contacts', async (req, res) => {
    try {
      const newContact = await createContact(req.body);
      res.status(201).json({
        status: 201,
        message: 'Successfully created contact!',
        data: newContact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.patch('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const updatedContact = await updateContact(contactId, req.body);

      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully updated contact!',
        data: updatedContact,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const deleted = await deleteContact(contactId);

      if (!deleted) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
