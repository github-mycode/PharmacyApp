using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Models;
using PharmacyApp.services;

namespace PharmacyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicineService _medicineService;
        private readonly ILogger<MedicinesController> _logger;

        public MedicinesController(IMedicineService medicineService, ILogger<MedicinesController> logger)
        {
            _medicineService = medicineService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Medicine>>> GetAll([FromQuery] string? name)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(name))
                {
                    var result = await _medicineService.SearchByNameAsync(name);
                    return Ok(result);
                }
                var medicines = await _medicineService.GetAllAsync();
                return Ok(medicines);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving medicines");
                return StatusCode(500, new { message = "An error occurred while retrieving medicines" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medicine>> GetById(Guid id)
        {
            try
            {
                var result = await _medicineService.GetByIdAsync(id);
                if (result == null)
                {
                    return NotFound(new { message = $"Medicine with ID {id} not found" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving medicine with ID: {MedicineId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the medicine" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Medicine>> Create([FromBody] Medicine medicine) 
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var createMedicine = await _medicineService.AddAsync(medicine);
                return CreatedAtAction(nameof(GetById), new { id = createMedicine.Id }, createMedicine);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating medicine");
                return StatusCode(500, new { message = "An error occurred while creating the medicine" });
            }
        }

        [HttpPut]
        public async Task<ActionResult<Medicine>> Update(Guid id, [FromBody] Medicine medicine)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var updateMedicine = await _medicineService.UpdateAsync(id, medicine);
                return Ok(updateMedicine);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message});
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating medicine with ID: {MedicineId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the medicine" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                var deleted = await _medicineService.DeleteAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = $"Medicine with ID {id} not found" });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting medicine with ID: {MedicineId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the medicine" });
            }
        }

        [HttpPost("sale")]
        public async Task<ActionResult<SaleRecord>> recordSale([FromBody] SaleRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var sale = await _medicineService.RecordSaleAsync(request);
                return Ok(sale);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording sale");
                return StatusCode(500, new { message = "An error occurred while recording the sale" });
            }
        }
        [HttpGet("sales")]
        public async Task<ActionResult<SaleRecord>> getSalesHistory()
        {
            try
            {
                var sales = await _medicineService.GetSalesHistoryAsync();
                return Ok(sales);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sales history");
                return StatusCode(500, new { message = "An error occurred while retrieving sales history" });
            }
        }
    }
}
