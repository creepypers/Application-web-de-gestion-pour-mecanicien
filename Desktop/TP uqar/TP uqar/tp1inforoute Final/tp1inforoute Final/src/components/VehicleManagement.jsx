import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addVehicle, deleteVehicle, updateVehicle, fetchVehicleByVin, fetchVehicleByDetails, fetchMakes, fetchModelsForMakeYear } from '../store/slices/vehiclesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VehicleManagement() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const vehicles = useSelector(state => 
    state.vehicles.vehicles.filter(v => v.userId === user.id)
  );
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', vin: '' });
  const [mode, setMode] = useState('manual');
  const [expandedVehicle, setExpandedVehicle] = useState(null);
  const [repairMode, setRepairMode] = useState(null);
  const [error, setError] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const makes = useSelector(state => state.vehicles.makes);
  const availableModels = useSelector(state => state.vehicles.models);
  const [filteredMakes, setFilteredMakes] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const years = Array.from({ length: 2024 - 1995 + 1 }, (_, i) => 2024 - i);

  const handleInputChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingVehicle({ ...editingVehicle, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (mode === 'manual_nhtsa') {
      dispatch(fetchMakes());
    }
  }, [mode, dispatch]);

  useEffect(() => {
    if (newVehicle.make && newVehicle.year && mode === 'manual_nhtsa') {
      dispatch(fetchModelsForMakeYear({ make: newVehicle.make, year: newVehicle.year }));
    }
  }, [newVehicle.make, newVehicle.year, mode, dispatch]);

  const handleMakeSearch = (input) => {
    if (!input) {
      setFilteredMakes([]);
      return;
    }
    const filtered = makes.filter(make => 
      make.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
    setFilteredMakes(filtered);
  };

  const handleModelSearch = (input) => {
    if (!input) {
      setFilteredModels([]);
      return;
    }
    const filtered = availableModels.filter(model => 
      model.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
    setFilteredModels(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      let result;
      if (mode === 'vin') {
        result = await dispatch(fetchVehicleByVin({
          vin: newVehicle.vin,
          userId: user.id
        }));
      } else if (mode === 'manual_nhtsa') {
        result = await dispatch(fetchVehicleByDetails({ 
          make: newVehicle.make,
          year: newVehicle.year,
          modelName: newVehicle.model,
          userId: user.id
        }));
      } else {
        dispatch(addVehicle({
          make: newVehicle.make,
          model: newVehicle.model,
          year: newVehicle.year,
          vin: newVehicle.vin || 'Not provided',
          style: 'N/A',
          engine: 'N/A',
          countryOfAssembly: 'N/A',
          userId: user.id
        }));
      }
      
      if (result && result.error) {
        throw new Error(result.error.message);
      }
      
      setNewVehicle({ make: '', model: '', year: '', vin: '' });
    } catch (error) {
      setError("Une erreur s'est produite lors de l'ajout du véhicule. Veuillez réessayer.");
      console.error("Error adding vehicle:", error);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteVehicle(id));
    if (expandedVehicle === id) setExpandedVehicle(null);
    if (repairMode === id) setRepairMode(null);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateVehicle(editingVehicle));
    setEditingVehicle(null);
  };

  const toggleVehicleDetails = (id) => {
    setExpandedVehicle(expandedVehicle === id ? null : id);
    setRepairMode(null);
  };

  const toggleRepairMode = (id, mode) => {
    if (repairMode === `${id}-${mode}`) {
      setRepairMode(null);
    } else {
      setRepairMode(`${id}-${mode}`);
      setExpandedVehicle(null);
    }
  };

  const renderRepairHistory = (vehicle) => (
    <>
      <h6 className="mt-3"><FontAwesomeIcon icon="history" className="me-2" />Historique des réparations</h6>
      {vehicle.repairHistory.length === 0 ? (
        <p>Aucun historique de réparation disponible pour ce véhicule.</p>
      ) : (
        <ul className="list-group">
          {vehicle.repairHistory.map((repair, index) => (
            <li key={index} className="list-group-item">
              <strong>{new Date(repair.date).toLocaleDateString()}</strong> : {repair.description} - {repair.cost}€
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h3><FontAwesomeIcon icon="plus-circle" className="me-2" />Ajouter un nouveau véhicule</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Mode de saisie :</label>
            <div>
              <button type="button" className={`btn btn-sm ${mode === 'vin' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setMode('vin')}>VIN</button>
              <button type="button" className={`btn btn-sm ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setMode('manual')}>Manuel</button>
              <button type="button" className={`btn btn-sm ${mode === 'manual_nhtsa' ? 'btn-primary' : 'btn-secondary'} me-2`} onClick={() => setMode('manual_nhtsa')}>Manuel NHTSA</button>
            </div>
          </div>
          {mode === 'vin' ? (
            <div className="mb-3">
              <label htmlFor="vin" className="form-label">VIN :</label>
              <input type="text" className="form-control" id="vin" name="vin" value={newVehicle.vin} onChange={handleInputChange} required />
            </div>
          ) : mode === 'manual' ? (
            <>
              <div className="mb-3">
                <label htmlFor="make" className="form-label">Marque :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="make" 
                  name="make" 
                  value={newVehicle.make} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="model" className="form-label">Modèle :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="model" 
                  name="model" 
                  value={newVehicle.model} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">Année :</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="year" 
                  name="year" 
                  value={newVehicle.year} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="vin" className="form-label">VIN (optionnel) :</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="vin" 
                  name="vin" 
                  value={newVehicle.vin} 
                  onChange={handleInputChange} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label htmlFor="make" className="form-label">Marque :</label>
                <input
                  type="text"
                  className="form-control"
                  id="make"
                  name="make"
                  value={newVehicle.make}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleMakeSearch(e.target.value);
                  }}
                  autoComplete="off"
                  required
                />
                {filteredMakes.length > 0 && (
                  <ul className="list-group mt-1 position-absolute" style={{ zIndex: 1000, width: '95%' }}>
                    {filteredMakes.map((make, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setNewVehicle({ ...newVehicle, make });
                          setFilteredMakes([]);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {make}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">Année :</label>
                <select
                  className="form-select"
                  id="year"
                  name="year"
                  value={newVehicle.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionner une année</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="model" className="form-label">Modèle :</label>
                <input
                  type="text"
                  className="form-control"
                  id="model"
                  name="model"
                  value={newVehicle.model}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleModelSearch(e.target.value);
                  }}
                  autoComplete="off"
                  required
                  disabled={!newVehicle.make || !newVehicle.year}
                />
                {filteredModels.length > 0 && (
                  <ul className="list-group mt-1 position-absolute" style={{ zIndex: 1000, width: '95%' }}>
                    {filteredModels.map((model, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setNewVehicle({ ...newVehicle, model });
                          setFilteredModels([]);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {model}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary">Ajouter le véhicule</button>
        </form>
      </div>
      <div className="col-md-6">
        <h3><FontAwesomeIcon icon="car" className="me-2" />Vos véhicules</h3>
        <div className="vehicle-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
          {vehicles.length === 0 ? (
            <p>Vous n'avez pas encore ajouté de véhicule.</p>
          ) : (
            <div className="vehicle-list">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="card mb-3">
                  <div className="card-body">
                    {editingVehicle && editingVehicle.id === vehicle.id ? (
                      <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                          <label htmlFor="make" className="form-label">Marque :</label>
                          <input type="text" className="form-control" id="make" name="make" value={editingVehicle.make} onChange={handleEditInputChange} required />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="model" className="form-label">Modèle :</label>
                          <input type="text" className="form-control" id="model" name="model" value={editingVehicle.model} onChange={handleEditInputChange} required />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="year" className="form-label">Année :</label>
                          <input type="number" className="form-control" id="year" name="year" value={editingVehicle.year} onChange={handleEditInputChange} required />
                        </div>
                        <button type="submit" className="btn btn-success">Mettre à jour</button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingVehicle(null)}>Annuler</button>
                      </form>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title mb-0">{vehicle.make} {vehicle.model}</h5>
                          <div>
                            <button 
                              className="btn btn-link text-warning p-0 me-2" 
                              onClick={() => handleEdit(vehicle)}
                              title="Modifier le véhicule"
                            >
                              <FontAwesomeIcon icon="edit" />
                            </button>
                            <button 
                              className="btn btn-link text-primary p-0 me-2" 
                              onClick={() => toggleVehicleDetails(vehicle.id)}
                              title={expandedVehicle === vehicle.id ? "Masquer les détails" : "Voir les détails"}
                            >
                              <FontAwesomeIcon icon={expandedVehicle === vehicle.id ? "chevron-up" : "chevron-down"} />
                            </button>
                            <button 
                              className="btn btn-link text-danger p-0" 
                              onClick={() => handleDelete(vehicle.id)}
                              title="Supprimer le véhicule"
                            >
                              <FontAwesomeIcon icon="trash-alt" />
                            </button>
                          </div>
                        </div>
                        <p className="card-text"><FontAwesomeIcon icon="calendar-alt" className="me-2" />Année : {vehicle.year || 'N/A'}</p>
                        <p className="card-text"><FontAwesomeIcon icon="fingerprint" className="me-2" />VIN : {vehicle.vin || 'N/A' }</p>
                        {expandedVehicle === vehicle.id && (
                          <>
                            <p className="card-text"><FontAwesomeIcon icon="car" className="me-2" />Style : {vehicle.style || 'N/A'}</p>
                            <p className="card-text"><FontAwesomeIcon icon="cogs" className="me-2" />Moteur : {vehicle.engine || 'N/A'}</p>
                            <p className="card-text"><FontAwesomeIcon icon="flag" className="me-2" />Pays d'assemblage : {vehicle.countryOfAssembly || 'N/A'}</p>
                          </>
                        )}
                        <div className="mt-2 d-flex justify-content-end">
                          <button className="btn btn-info btn-sm me-2" onClick={() => toggleRepairMode(vehicle.id, 'history')}>
                            <FontAwesomeIcon icon="history" /> Historique des réparations
                          </button>
                        </div>
                        {repairMode === `${vehicle.id}-history` && renderRepairHistory(vehicle)}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
