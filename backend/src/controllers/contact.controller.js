const contactModel = require('../models/contact.model');

const healthCheck = (req, res) => {
    res.status(200).json({ message: 'Contact API is running smoothly' });
}
const createContact = async (req, res) => {
    try {
        const { name, email, phone, detail } = req.body;
        const contact = await contactModel.findOne({ $or: [{ email }, { phone }] });
        if (contact) {
            return res.status(400).json({ message: 'Contact with this email or phone already exists' });
        }
        const newContact = new contactModel({ name, email, phone, detail });
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact: ' + error.message });
    }
}

const updateContact = async (req, res) => {
    try {
        const { name, email, phone, detail } = req.body;
        const contact = await contactModel.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
        contact.detail = detail;
        await contact.save();
        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact: ' + error.message });
    }
}

const deleteContact = async (req, res) => {
    try{
        const contact = await contactModel.findById(req.params.id);
        if(!contact){
            return res.status(404).json({ message: 'Contact not found' });
        }
        await contactModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Contact deleted successfully' });
    }catch (error) {
        res.status(500).json({ message: 'Error deleting contact: ' + error.message });
    }
}

module.exports = {
    createContact,
    updateContact,
    deleteContact,
    healthCheck
};