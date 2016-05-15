// Recipe Box code

var Panel = ReactBootstrap.Panel;
var Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

// Load Recipe items or set default recipe items
var recipes = (typeof localStorage['recipeBox'] != 'undefined') ?
                JSON.parse(localStorage['recipeBook']) : [
                  { title: 'Pumpkin Pie', ingredients: ['Pumpkin Puree', 'Sweetened Condensed Milk', 'Eggs', 'Pumpkin Pie Spice', 'Pie Crust'] },
                  { title: 'Spaghetti', ingredients: ['Noodles', 'Tomato Souce', 'Meatballs'] },
                  { title: 'Onion Pie', ingredients: ['Onion', 'Pie Crust', 'Sounds Yummy right?'] }
                ], globalTitle = '', globalIngredients = []; // Define global title and ingredients

// Recipe class that holds all recipes
class RecipeBox extends React.Component {
  render() {
    return (
      <div>
        <Accordion>
          { this.props.data }
        </Accordion>
      </div>
    );
  }
}

// Recipe class that displays for a recipe in RecipeBook
class Recipe extends React.Component {
  remove() {
    recipes.splice(this.props.index, 1);
    update();
  }

  edit() {
    globalTitle = this.props.title;
    globalIngredients = this.props.ingredients;
    document.getElementById('show').click();
  }

  render() {
    return (
      <div>
        <h4 className='text-center'>ingredients</h4><hr/>
        <IngredientList ingredients={ this.props.ingredients } />
        <ButtonToolbar>
          <Button className='delete' bsStyle='danger' id={ 'btn-del' + this.props.index } onClick={ this.remove }>Delete</Button>
          <Button bsStyle='default' id={ 'btn-edit' + this.props.index } onClick={ this.edit }>Edit</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

// IngredientList class that lists all ingredients for a Recipe
class IngredientList extends React.Component {
  render() {
    var IngredientList = this.props.ingredients.map((ingredient) => {
      return (
        <ListGroupItem>
          { ingredient }
        </ListGroupItem>
      );
    });
    return (
      <ListGroup>
        { IngredientList }
      </ListGroup>
    );
  }
}

// RecipeAdd class that contains the Modal and Add Recipe buttons
class RecipeAdd extends React.Component {
  getInitialState() {
    return {
      showModal: false
    };
  }

  close() {
    globalTitle = '';
    globalIngredients = [];
    this.setState({
      showModal: false
    });
  }

  open() {
    this.setState({
      showModal: true
    });
    if (document.getElementById('title') && document.getElementById('ingredients')) {
      $('#title').val(globalTitle);
      $('#ingredients').val(globalIngredients);
      if (globalTitle != '') {
        $('#modalTitle').text('Edit Recipe');
        $('#addButton').text('Edit Recipe');
      }
    }
    else requestAnimationFrame(this.open);
  }

  add() {
    var title = document.getElementById('title').value;
    var ingredients = document.getElementById('ingredients').value.split(',');
    var exists = false;
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].title === title) {
        recipes[i].ingredients = ingredients;
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (title.length < 1) title = 'Untitled';
      recipes.push({title: title, ingredients: document.getElementById('ingredients').value.split(',')});
    }
    update();
    this.close();
  }

  render() {
    return (
      <div>
        <Button
          bsStyle = 'primary'
          bsSize = 'large'
          onClick = { this.open }
          id = 'show'
        >
          Add Recipe
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title id='modalTitle'>
              Add a Recipe
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <Input type='text' label='Recipe' placeholder='Recipe Name' id='title' />
              <Input type='textarea' label='Ingredients' placeholder='Enter Ingredients,Separated,By Commas' id='ingredients' />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.add} bsStyle='primary' id='addButton'>Add Recipe</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Update function to display all the recipes
function update() {
  localStorage.setItem('recipeBook', JSON.stringify(recipes));
  var rows = [];
  for (var i = 0; i < recipes.length; i++) {
    rows.push(
      <Panel header={recipes[i].title} eventKey={i} bsStyle='success'>
        <Recipe title={recipes[i].title} ingredients={recipes[i].ingredients} index={i}/>
      </Panel>
    );
  }
  ReactDOM.render(<RecipeBook data={rows}/>, document.getElementById('container'));
}

// Render the add button (and modal)
ReactDOM.render(<RecipeAdd/>, document.getElementById('button'));
update(); // Initially render the recipe book
